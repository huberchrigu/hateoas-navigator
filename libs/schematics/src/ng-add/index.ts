import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';
import {addPackageToPackageJson} from './package-config';
import {WorkspaceProject, WorkspaceSchema} from '@angular-devkit/core/src/workspace';
import {addModuleImportToRootModule} from './ast';
import {getProjectMainFile} from './project-main-file';
import {getWorkspace} from '@schematics/angular/utility/config';
import {documentComponentsVersion, hateoasNavigatorVersion} from './version-names';

// per file.
export function schematics(options: any): Rule {
  return () => {
    return chain([
      addPackageJsonDependencies(),
      installPackageJsonDependencies(),
      addProxyConfig(options),
      addProxyConfigFile(),
      addModuleToImports(options),
      addGenericRoutes(options),
      replaceDemoMarkup(options)
    ]);
  };
}

// You don't have to export the function as default. You can also have more than one rule factory
function addPackageJsonDependencies() {
  return (host: Tree, context: SchematicContext) => {
    const dependencies = [
      {version: '^6.3.3', name: 'rxjs-compat'},
      {version: '^0.0.29', name: 'md2'},
      {version: '^2.22.2', name: 'moment'},
      {version: `~${hateoasNavigatorVersion}`, name: 'hateoas-navigator'},
      {version: `~${documentComponentsVersion}`, name: 'document-components'}
    ];

    dependencies.forEach(dependency => {
      addPackageToPackageJson(host, dependency.name, dependency.version);
      context.logger.log('info', `✅️ Added "${dependency.name} ${dependency.version}"`);
    });

    return host;
  };
}

function installPackageJsonDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);

    return tree;
  };
}

function addModuleToImports(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const project = getProject(tree, options);

    addModuleImportToRootModule(tree, 'HalNavigatorModule.forRoot(undefined)', 'hateoas-navigator', project);
    addModuleImportToRootModule(tree, 'DocumentComponentsModule', 'document-components', project);
    context.logger.log('info', `✅️ "HalNavigatorModule and DocumentComponentsModule are imported`);

    return tree;
  };
}

function addGenericRoutes(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    const source = `
    import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CollectionResolverService, ResourceDescriptorResolverService, ResourceObjectResolverService, RouteParams} from 'hateoas-navigator';
import {ResourceFormComponent, ResourceItemComponent, ResourceListComponent} from 'document-components';

const routes: Routes = [{
  path: ':' + RouteParams.RESOURCE_PARAM + '/new',
  component: ResourceFormComponent,
  resolve: { resourceDescriptor: ResourceDescriptorResolverService }
},
  {
    path: \`:\${RouteParams.RESOURCE_PARAM}/:\${RouteParams.ID_PARAM}\`,
    component: ResourceItemComponent,
    resolve: {
      resourceObject: ResourceObjectResolverService
    }
  },
  {
    path: \`:\${RouteParams.RESOURCE_PARAM}/:\${RouteParams.ID_PARAM}/edit\`,
    component: ResourceFormComponent,
    resolve: {
      resourceObject: ResourceObjectResolverService
    }
  },
  {
    path: ':' + RouteParams.RESOURCE_PARAM,
    component: ResourceListComponent,
    resolve: {
      collectionAdapter: CollectionResolverService
    }
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
`;
    return replaceFile(host, options, source, '-routing.module.ts', context);
  };
}

function addProxyConfig(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {

    try {
      const angularJsonFile = host.read('angular.json');

      if (angularJsonFile) {
        const angularJsonFileObject = JSON.parse(angularJsonFile.toString('utf-8'));
        const project = options.project ? options.project : Object.keys(angularJsonFileObject['projects'])[0];
        const projectObject = angularJsonFileObject.projects[project];
        const serveOptions = projectObject.architect.serve.options;
        serveOptions.proxyConfig = 'src/proxy.conf.json';

        host.overwrite('angular.json', JSON.stringify(angularJsonFileObject, null, 2));
      }
    } catch (e) {
      context.logger.log('error', `🚫 Failed to add the proxy configuration to angular.json (${e})`);
    }

    context.logger.log('info', `✅️ Added the proxy configuration to angular.json`);

    return host;
  };
}

function addProxyConfigFile(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const config = {
      '/api': {
        'target': 'http://localhost:8080',
        'secure': false,
        'pathRewrite': {
          '^/api': ''
        }
      }
    };
    try {
      host.create('src/proxy.conf.json', JSON.stringify(config));
      context.logger.log('info', `✅️ Create proxy configuration file`);
    } catch (e) {
      context.logger.log('error', `🚫 Failed to add the proxy configuration file (${e})`);
    }
    return host;
  };
}

function replaceDemoMarkup(options: any) {
  return (host: Tree, context: SchematicContext) => {
    const markup = `
    <app-navigation></app-navigation>
<div id="cmp-content" class="mat-elevation-z2">
  <router-outlet></router-outlet>
</div>
  `;
    return replaceFile(host, options, markup, '.component.html', context);
  };
}

function replaceFile(host: Tree, options: any, content: string, suffix: string, context: SchematicContext) {
  const project = getProject(host, options);
  const src = getSrcPath(host, options);
  const fileName = src + `/${project.prefix}/${project.prefix}${suffix}`;
  try {
    host.overwrite(fileName, content);
    context.logger.log('info', `✅️ File ${fileName} overwritten`);
  } catch (e) {
    context.logger.log('error', `🚫 Could not overwrite file ${fileName} (${e})`);
  }
  return host;
}

/**
 * Finds the specified project configuration in the workspace. Throws an error if the project
 * couldn't be found.
 */
export function getProjectFromWorkspace(workspace: WorkspaceSchema, projectName?: string): WorkspaceProject {
  const name = projectName == null ? workspace.defaultProject : projectName;
  if (name == null) {
    throw new Error('No project name given');
  }
  let project = workspace.projects[name];

  if (!project) {
    throw new Error(`Could not find project in workspace: ${projectName}`);
  }

  return project;
}

function getProject(host: Tree, options: any) {
  const workspace = getWorkspace(host);
  return getProjectFromWorkspace(
    workspace,
    // Takes the first project in case it's not provided by CLI
    options.project ? options.project : Object.keys(workspace['projects'])[0]
  );
}

function getSrcPath(host: Tree, options: any) {
  const mainFile = getProjectMainFile(getProject(host, options));
  return mainFile == null ? null : mainFile.substring(0, mainFile.lastIndexOf('/'));
}
