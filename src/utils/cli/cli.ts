import inquirer from 'inquirer';

export const askSettings = () => {
    return inquirer
        .prompt({
            name: 'PORT',
            message: '¿En qué puerto quieres que se inicie la API?',
            type: 'input',
            validate: (value) => {
                if (isNaN(value)) {
                    return 'Please enter a number';
                }

                process.env.PORT = value;
                return true;
            },
        })
        .then(() => {
            return inquirer
                .prompt({
                    type: 'list',
                    name: 'roles',
                    message: 'asdasd',
                    choices: ['TESTING', 'DEVELOPING'],
                })
                .then((answers) => {
                    console.log(answers.roles);
                });
        });
};
