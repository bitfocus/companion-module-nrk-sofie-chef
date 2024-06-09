export function setupActions(instance) {
	instance.setActionDefinitions({
		playUrl: {
			name: 'Play URL',
			description: 'Make a window play an URL',
			options: [
				{
					type: 'dropdown',
					label: 'Window',
					id: 'windowId',
					default: 'default',
					choices: instance.getWindowChoices(),
				},
				{
					type: 'textinput',
					label: 'URL',
					id: 'url',
				},
				{
					type: 'textinput',
					label: 'JavaScript Code',
					id: 'jsCode',
				},
			],
			callback: async (action, context) => {
				instance.sendWebSocketJSON('playurl', action.options)
			},
		},
		restart: {
			name: 'Restart',
			description: 'Make a window restart (reload)',
			options: [
				{
					type: 'dropdown',
					label: 'Window',
					id: 'windowId',
					default: 'default',
					choices: instance.getWindowChoices(),
				},
			],
			callback: async (action, context) => {
				instance.sendWebSocketJSON('restart', action.options)
			},
		},
		stop: {
			name: 'Stop',
			description: 'Make a window stop (unload)',
			options: [
				{
					type: 'dropdown',
					label: 'Window',
					id: 'windowId',
					default: 'default',
					choices: instance.getWindowChoices(),
				},
			],
			callback: async (action, context) => {
				instance.sendWebSocketJSON('stop', action.options)
			},
		},
		execute: {
			name: 'Execute',
			description: 'Make a window execute javascript',
			options: [
				{
					type: 'dropdown',
					label: 'Window',
					id: 'windowId',
					default: 'default',
					choices: instance.getWindowChoices(),
				},
				{
					type: 'textinput',
					label: 'JavaScript Code',
					id: 'jsCode',
				},
			],
			callback: async (action, context) => {
				instance.sendWebSocketJSON('execute', action.options)
			},
		},
	})
}
