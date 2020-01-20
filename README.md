# Reactive counter control

This project shows an example of implementing a dynamic counter taking ideas from closed-loop/feedback control systems.

A feedback control system feeds its output back to its input so that its state is influenced by not only the users but also the side-effects generated from their interactions. For example, when the user starts the count, the side-effects are the timer ticks comming from some async process. The ticks are directed back to the count input port to update its value.

Some other design choices:
-   Strict separation of logic and view (for me this is more of a must)
-   Events/data never leave the control loop until shown on UI
-   Reactive programming, in particular rxjs, is used here to model the control loop

# References

-   [Operate heavily dynamic uis](https://github.com/BioPhoton/ng-operate-heavily-dynamic-uis)
-   Feedback control systems
-   Constructing the User Interface with Statecharts by Ian Horrocks

# Running with Angular
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

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
