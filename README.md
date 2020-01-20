# HATEOAS Navigator & Resource Components
[![Build Status](https://travis-ci.org/huberchrigu/hateoas-navigator.svg?branch=master)](https://travis-ci.org/huberchrigu/hateoas-navigator)

## How to get started
### Run demo
[Run this project](#Development server) and provide the [demo's backend](https://github.com/huberchrigu/setty-mongo). The backend requires a local mongo database.

### Tutorial
You can find a [tutorial on github](https://github.com/huberchrigu/hateoas-navigator-tutorial) with instructions on how to start a new project
and a sample Angular frontend and Spring backend.

## Features
### HATEOAS Navigator Features
* Customize interface with [`ModuleConfiguration`](libs/hateoas-navigator/src/lib/hal-navigator/config/module-configuration.ts) (since _0.1.0_) ([Example](projects/demo/src/app/app.module.ts))
* Resolvers that prefetch [a collection of resources](libs/hateoas-navigator/src/lib/hal-navigator/collection/collection-resolver.service.ts), [a single resource object](libs/hateoas-navigator/src/lib/hal-navigator/item/resource-object-resolver.service.ts) or
  [a resource descriptor](libs/hateoas-navigator/src/lib/hal-navigator/descriptor/resolver/resource-descriptor-resolver.service.ts) (since _0.1.0_) ([Example](libs/resource-components/src/lib/generic-routes.ts))
* [`ResourceService`](libs/hateoas-navigator/src/lib/hal-navigator/resource-services/resource.service.ts) that fetches resources from the API and handles cross-concerns like resource caching (since _0.1.0_)
* [`FormControlFactory`](libs/hateoas-navigator/src/lib/hal-navigator/form/form-control-factory.ts) transforms a [`ResourceAdapter`](libs/hateoas-navigator/src/lib/hal-navigator/hal-resource/resource-object-property-impl.ts) into Angular form controls (since _0.1.0_)
* [Links](libs/hateoas-navigator/src/lib/hal-navigator/link-object/resource-link.ts) from one resource to others are automatically generated and can easily be used for according operations (since _0.1.0_)
* `debugDescriptor` request parameter to print debug information about [schema to resource descriptor mapping](libs/hateoas-navigator/src/lib/hal-navigator/descriptor/combining/combining-descriptor-mapper.ts) (since _0.1.0_) ([Example](http://localhost:4200/persons?debugDescriptor=persons))

### Resource Components Features
* [Wild card routes](libs/resource-components/src/lib/generic-routes.ts) that handle all provided resources (since _0.1.0_) ([Example](projects/demo/src/app/app-routing/app-routing.module.ts))
* Components that [list resources](libs/resource-components/src/lib/resource-list/resource-list.component.ts), [display single resources](libs/resource-components/src/lib/resource-item/resource-item.component.ts) and [generates forms for editing them](libs/resource-components/src/lib/resource-form/resource-form.component.ts) (since _0.1.0_) ([Example](libs/resource-components/src/lib/generic-routes.ts))

### Planned Features
* Replacing generic `Resource Components` by custom components
* API simplifications
* Improved debugging

## Architecture

Yet the [architecture is documented](documentation) as [PlantUML](http://plantuml.com) diagrams.

## Blog Posts

* [Domain Prototyping](https://medium.com/sprang/domain-prototyping-9a5f09a14f6d): How to quickly prototype domain logic with _HATEOAS Navigator_.

# Angular CLI
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Demo
Run `ng serve demo` for running the demo. It requires the backend ["setty-mongo"](https://github.com/huberchrigu/setty-mongo).

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
