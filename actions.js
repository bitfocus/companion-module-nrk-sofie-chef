export function setupActions(instance) {
	instance.setActionDefinitions({
		play: {
			name: 'Play',
			description: 'Make a window play an URL',
			options: [
				{
					type: 'dropdown',
					label: 'Window',
					id: 'window',
					default: 'default',
					choices: instance.getWindowChoices(),
				},
				{
					type: 'textinput',
					label: 'URL',
					id: 'url',
				},
			],
			callback: async (action, context) => {
				instance.ws.send(
					JSON.stringify({
						type: 'playurl',
						msgId: 1,
						windowId: action.options.window,
						url: action.options.url,
					})
				)
			},
		},
		restart: {
			name: 'Restart',
			description: 'Make a window restart (reload)',
			options: [
				{
					type: 'dropdown',
					label: 'Window',
					id: 'window',
					default: 'default',
					choices: instance.getWindowChoices(),
				},
			],
			callback: async (action, context) => {
				instance.ws.send(
					JSON.stringify({
						type: 'restart',
						msgId: 1,
						windowId: action.options.window,
					})
				)
			},
		},
		stop: {
			name: 'Stop',
			description: 'Make a window stop (unload)',
			options: [
				{
					type: 'dropdown',
					label: 'Window',
					id: 'window',
					default: 'default',
					choices: instance.getWindowChoices(),
				},
			],
			callback: async (action, context) => {
				instance.ws.send(
					JSON.stringify({
						type: 'stop',
						msgId: 1,
						windowId: action.options.window,
					})
				)
			},
		},
	})
}
