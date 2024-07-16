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
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'JavaScript Code',
					id: 'jsCode',
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const urlValue = await context.parseVariablesInString(action.options.url)
				const jsCodeValue = await context.parseVariablesInString(action.options.jsCode)
				instance.sendWebSocketJSON('playurl', { windowId: action.options.windowId, url: urlValue, jsCode: jsCodeValue })
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
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const jsCodeValue = await context.parseVariablesInString(action.options.jsCode)
				instance.sendWebSocketJSON('execute', { windowId: action.options.windowId, jsCode: jsCodeValue })
			},
		},
	})
}
