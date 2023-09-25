import { inject, injectable, interfaces } from '@theia/core/shared/inversify';

import {
    Command, CommandContribution, CommandRegistry, MAIN_MENU_BAR,
    MenuContribution, MenuModelRegistry, MessageService
} from '@theia/core/lib/common';
import {ConfirmDialog} from '@theia/core/lib/browser';

// simple pop up window
const TestCommand: Command = {
    id: 'test-command',
    label: 'Test Command'
};

// simple dialog with a message, cancel and ok buttons
const TestDialog: Command = {
    id: 'test-dialog',
    label: 'Test Dialog'
};

const TestMessage1: Command = {
    id: 'test-message1',
    label: 'Test Message Info'
};

const TestMessage2: Command = {
    id: 'test-message2',
    label: 'Test Progress Info'
};


@injectable()
export class TestMenuContribution implements MenuContribution {
    registerMenus(menus: MenuModelRegistry): void {
        const subMenuPath = [...MAIN_MENU_BAR, 'test-menu'];
        menus.registerSubmenu(subMenuPath, 'Test Menu', {
            order: '2'
        });
        menus.registerMenuAction(subMenuPath, {
            commandId: TestCommand.id,
            order: '0'
        });
        menus.registerMenuAction(subMenuPath, {
            commandId: TestDialog.id,
            order: '1'
        });
        const subSubMenuPath = [...subMenuPath, 'sample-sub-menu'];
        menus.registerSubmenu(subSubMenuPath, 'Sample sub menu', { order: '2' });
        menus.registerMenuAction(subSubMenuPath, {
            commandId: TestMessage1.id,
            order: '0'
        });
        menus.registerMenuAction(subSubMenuPath, {
            commandId: TestMessage2.id,
            order: '1'
        });

    }
}

@injectable()
export class TestCommandContribution implements CommandContribution {

    @inject(MessageService)
    protected readonly messageService: MessageService;
    
    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(TestCommand, {
            execute: () => {
                alert('Amalia: Test command.');
            }
        });
        commands.registerCommand(TestDialog, {
            execute: async () => {
                await new ConfirmDialog({
                    title: 'Confirm Dialog',
                    msg: 'Testing confirm dialog.'
                }).open();
            }
        });
        commands.registerCommand(TestMessage1, {
            execute: async () => { 
               await this.messageService.info('Message Service: Info. ') 
            }
        });
        commands.registerCommand(TestMessage2, {
            execute: () => {
                this.messageService
                    .showProgress({
                        text: 'Starting to report progress',
                    })
                    .then(progress => {
                        window.setTimeout(() => {
                            progress.report({
                                message: 'First step completed',
                                work: { done: 25, total: 100 }
                            });
                        }, 2000);
                        window.setTimeout(() => {
                            progress.report({
                                message: 'Next step completed',
                                work: { done: 60, total: 100 }
                            });
                        }, 4000);
                        window.setTimeout(() => {
                            progress.report({
                                message: 'Complete',
                                work: { done: 100, total: 100 }
                            });
                        }, 6000);
                        window.setTimeout(() => progress.cancel(), 7000);
                    });
            }
        })

    }

}

export const bindTestMenu = (bind: interfaces.Bind) => {
    bind(CommandContribution).to(TestCommandContribution).inSingletonScope();
    bind(MenuContribution).to(TestMenuContribution).inSingletonScope();
};
