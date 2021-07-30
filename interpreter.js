const { lookup } = require('dns');
const fs = require('fs');
const { resolve } = require('path');
const path = require('path');

const rootPath = path.resolve(__dirname);
const getJobPath = param => path.resolve(rootPath, param);

const logger = require('./util/Logger');

async function Run(jobName) {

    logger.log(`processing ${jobName}`);

    const jobPath = getJobPath(jobName);
    const jobRootFolder = path.dirname(jobPath);

    logger.log(`paths ${jobPath} ${jobRootFolder}`);

    const script = loadScript(jobPath);

    logger.log(JSON.stringify(script));

    await runCommands(script.main);

    async function runCommands(commands) {

        while (true) {

            let command = commands.shift();
            if (command == null) {
                break;
            }
            //console.log(command);
        
            if (command.enable !== false) {
                switch (command.type) {
                    case 'if':
                        logger.log(`eval ${command.expression}`);

                        const result = eval(command.expression);
                        if(result === true) {
                            logger.log('result true');
                            const commandList = getNewCommandList(command.true);
                            commands = commandList.concat(commands);
                        } else {
                            logger.log('result false');
                            const commandList = getNewCommandList(command.false);
                            commands = commandList.concat(commands);
                        }
                        break;
                    case 'log':
                        logger.log(`log: ${command.message}`);
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

Run('./jobs/example5/job.json');