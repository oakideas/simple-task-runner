const { lookup } = require('dns');
const fs = require('fs');
const { resolve } = require('path');
const path = require('path');

const rootPath = path.resolve(__dirname);
const getJobPath = param => path.resolve(rootPath, param);

const logger = require('../../util/Logger');

async function Run(jobName) {

    logger.log(`processing ${jobName}`);

    const jobPath = getJobPath(jobName);
    const jobRootFolder = path.dirname(jobPath);

    logger.log(`paths ${jobPath} ${jobRootFolder}`);

    const script = loadScript(jobPath);

    logger.log(JSON.stringify(script));

    await runCommands(script.main);

    async function runCommands(commands) 
    {

        while (true) {

            let command = commands.shift();
            let expression = null;

            if (command == null) {
                break;
            }
        
            if (command.enable !== false) {
                switch (command.type) {
                    case 'eval':
                        logger.log(`eval ${command.expression}`);
                        eval(command.expression);
                        break;
                    case 'if':
                        logger.log(`if ${command.expression}`);

                        expression = eval(command.expression);
                        if(expression === true) {
                            logger.log('result true');
                            const commandList = getNewCommandList(command.true);
                            commands = commandList.concat(commands);
                        } else {
                            logger.log('result false');
                            const commandList = getNewCommandList(command.false);
                            commands = commandList.concat(commands);
                        }
                        break;
                    case 'switch':
                        logger.log(`switch ${command.expression}`);

                        expression = eval(command.expression);
                        logger.log(`expression ${expression}`);

                        if(expression in command.case) {
                            const commandList = getNewCommandList(command.case[expression]);
                            commands = commandList.concat(commands);
                        } else if(command.default != null) {
                            logger.log('default');
                            const commandList = getNewCommandList(command.default);
                            commands = commandList.concat(commands);
                        }
                        break;
                    case 'for':
                        const commandList = getNewCommandList(command.actions);
                        eval(`for (${command.expression}) {
                            runCommands([...commandList]);
                          }`);
                        break;
                    case 'log':
                        const message = eval("`" + command.message + "`;");
                        logger.log(`log: ${message}`);
                        break;
                    default:
                        logger.log(`unknown command ${command.type}`);
                }
            }
        }
    }

    function getNewCommandList(expression) {
        if (typeof expression === 'string') {
            return script.functions[expression];
        } else {
            return expression;
        }
    }

    function loadScript(inputFile) {

        const fileBuffer = fs.readFileSync(inputFile, 'utf-8');
        const inputParams = JSON.parse(fileBuffer);
        return inputParams;

    }
}

Run('./job.json');