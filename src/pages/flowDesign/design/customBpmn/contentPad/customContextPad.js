export default function ContextPadProvider(
  config,
  injector,
  contextPad,
  modeling,
  elementFactory,
  connect,
  create,
  translate,
) {
  this.modeling = modeling;
  this.elementFactory = elementFactory;
  this.connect = connect;
  this.create = create;
  this.translate = translate;

  // eslint-disable-next-line no-param-reassign
  config = config || {};

  if (config.autoPlace !== false) {
    this.autoPlace = injector.get('autoPlace', false);
  }

  contextPad.registerProvider(this);
}

ContextPadProvider.$inject = [
  'config.contextPad',
  'injector',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'translate',
];

ContextPadProvider.prototype.getContextPadEntries = function (element) {
  const { autoPlace, create, elementFactory, translate, modeling, connect } =
    this;

  function appendAction(type, className, title, options) {
    function appendStart(event, element) {
      let shape = elementFactory.createShape(
        Object.assign({ type: type }, options),
      );
      create.start(event, shape, {
        source: element,
      });
    }

    let append = autoPlace
      ? function (event, element) {
          let shape = elementFactory.createShape(
            Object.assign({ type: type }, options),
          );
          autoPlace.append(element, shape);
        }
      : appendStart;

    return {
      group: 'model',
      className: className,
      title: title,
      action: {
        dragstart: appendStart,
        click: append,
      },
    };
  }

  function removeElement(e) {
    modeling.removeElements([element]);
  }

  let actions = {};

  if (
    element.type === 'bpmn:UserTask' ||
    element.type === 'bpmn:SequenceFlow'
  ) {
    Object.assign(actions, {
      edit: {
        group: 'edit',
        className: 'bpmn-icon-business-rule',
        title: translate('属性'),
        action: {
          click: (e) => {
            console.log(e);
          },
        },
      },
    });
  }

  Object.assign(actions, {
    delete: {
      group: 'edit',
      className: 'bpmn-icon-trash',
      title: translate('Remove'),
      action: {
        click: removeElement,
      },
    },
  });

  return actions;
};
