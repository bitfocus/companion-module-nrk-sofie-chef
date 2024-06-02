import { InstanceBase, runEntrypoint, InstanceStatus, Regex } from '@companion-module/base'
import WebSocket from 'ws'
import { upgradeScripts } from './upgrade.js'
import { setupActions } from './actions.js'
import { setupFeedbacks } from './feedbacks.js'

class SofieChefInstance extends InstanceBase {
	isInitialized = false

	async init(config) {
		this.config = config

		this.initWebSocket()
		this.isInitialized = true

		this.windows = []

		this.initActions()
		this.initFeedbacks()
	}

	async destroy() {
		this.isInitialized = false
		if (this.reconnect_timer) {
			clearTimeout(this.reconnect_timer)
			this.reconnect_timer = null
		}
		if (this.ws) {
			this.ws.close(1000)
			delete this.ws
		}
	}

	async configUpdated(config) {
		this.config = config
		this.initWebSocket()
	}

	maybeReconnect() {
		if (this.isInitialized && this.config.reconnect) {
			if (this.reconnect_timer) {
				clearTimeout(this.reconnect_timer)
			}
			this.reconnect_timer = setTimeout(() => {
				this.initWebSocket()
			}, 5000)
		}
	}

	initWebSocket() {
		if (this.reconnect_timer) {
			clearTimeout(this.reconnect_timer)
			this.reconnect_timer = null
		}

		const url = 'ws://' + this.config.targetIp + ':' + this.config.targetPort + '/'
		if (!url || !this.config.targetIp) {
			this.updateStatus(InstanceStatus.BadConfig, `IP address is missing`)
			return
		} else if (!url || !this.config.targetPort) {
			this.updateStatus(InstanceStatus.BadConfig, `Port is missing`)
			return
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.ws) {
			this.ws.close(1000)
			delete this.ws
		}
		this.ws = new WebSocket(url)

		this.ws.on('open', () => {
			this.updateStatus(InstanceStatus.Ok)
		})
		this.ws.on('close', (code) => {
			this.updateStatus(InstanceStatus.Disconnected, `Connection closed with code ${code}`)
			this.maybeReconnect()
		})

		this.ws.on('message', this.messageReceivedFromWebSocket.bind(this))

		this.ws.on('error', (data) => {
			this.log('error', `WebSocket error: ${data}`)
		})
	}

	parseSofieChefReply(data) {
		if (data.error != null) {
			this.log('error', data.error)
		}
		// TODO(Peter): Do something here
	}

	parseSofieChefStatus(data) {
		this.log('debug', 'Windows: ' + Object.keys(data.status.windows).join())
		this.windows = Object.keys(data.status.windows)

		this.initActions()
	}

	messageReceivedFromWebSocket(data) {
		this.log('debug', `WebSocket data: ` + data)
		let msgValue = null
		try {
			msgValue = JSON.parse(data)
		} catch (e) {
			msgValue = data
		}
		if (msgValue.type != null) {
			if (msgValue.type === 'reply') {
				this.parseSofieChefReply(msgValue)
			} else if (msgValue.type === 'status') {
				this.parseSofieChefStatus(msgValue)
			} else {
				this.log('error', `Unknown message type - webSocket data: ` + data)
			}
		}
	}

	sendWebSocketJSON(type, options) {
		var msg = {}
		msg['msgId'] = 1
		if (this.config.apiKey != null && this.config.apiKey !== '') {
			msg['apiKey'] = this.config.apiKey
		}
		msg['type'] = type
		this.log('debug', `Options: ` + JSON.stringify(options))
		for (let option of Object.keys(options)) {
			this.log('debug', `Option: ` + JSON.stringify(option))
			msg[option] = options[option]
		}
		this.log('debug', `WebSocket sending data: ` + JSON.stringify(msg))
		this.ws.send(JSON.stringify(msg))
	}

	getWindowChoices() {
		var dropdownChoices = []
		for (let i = 0; i < this.windows.length; i++) {
			const choice = {
				id: this.windows[i],
				label: `Window ${this.windows[i]}`,
			}
			dropdownChoices.push(choice)
		}
		return dropdownChoices
	}

	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'targetIp',
				label: 'Sofie Chef IP address',
				width: 12,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'targetPort',
				label: 'Port number',
				tooltip: 'WebSocket port is configured apiPort plus one',
				width: 6,
				default: '5271',
				regex: Regex.PORT,
			},
			{
				type: 'textinput',
				id: 'apiKey',
				label: 'API Key (Pre-shared key)',
				width: 6,
			},
			{
				type: 'checkbox',
				id: 'reconnect',
				label: 'Reconnect',
				tooltip: 'Reconnect on WebSocket error (after 5 secs)',
				width: 6,
				default: true,
			},
		]
	}

	initFeedbacks() {
		setupFeedbacks(this)
	}

	initActions() {
		setupActions(this)
	}
}

runEntrypoint(SofieChefInstance, upgradeScripts)
