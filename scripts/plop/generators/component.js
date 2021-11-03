module.exports = (plop) => {
  plop.setPartial('basePath', '../../../src')

  plop.setGenerator('component', {
    description: 'Create component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of a component?',
      },
      {
        type: 'list',
        name: 'componentType',
        message: 'What is the type of a component?',
        choices: ['Components', 'Screens', 'UI', 'Tables', 'Charts'],
      },
    ],
    actions: [
      {
        type: 'add',
        path: '{{> basePath}}/components/{{dashCase name}}/index.ts',
        templateFile: '../default-templates/index.ts.hbs',
      },
      {
        type: 'add',
        path: '{{> basePath}}/components/{{dashCase name}}/{{dashCase name}}.tsx',
        templateFile: '../default-templates/name.tsx.hbs',
      },
      {
        type: 'add',
        path: '{{> basePath}}/components/{{dashCase name}}/{{dashCase name}}-styled.tsx',
        templateFile: '../default-templates/name-styled.tsx.hbs',
      },
      {
        type: 'add',
        path: '{{> basePath}}/components/{{dashCase name}}/{{dashCase name}}.stories.tsx',
        templateFile: '../default-templates/name.stories.component.tsx.hbs',
      },
      {
        type: 'append',
        path: '{{> basePath}}/components/index.ts',
        separator: '',
        templateFile: '../default-templates/components-index.ts.hbs',
      },
    ],
  })
}
