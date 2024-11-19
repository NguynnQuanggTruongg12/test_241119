const brokerUrl = 'wss://604b372efa0e444ebbe062ca5d3e2243.s1.eu.hivemq.cloud:8884/mqtt';
const options = {
    username: 'truong',
    password: 'Lhh12345@@',
    clientId: 'web-client-' + Math.random().toString(16).substr(2, 8),
    protocolVersion: 4,
    clean: true,
};

const client = mqtt.connect(brokerUrl, options);

client.on('connect', function () {
    console.log('Connected to MQTT Broker!');
    sendCommand('RESET');
    sendCommand('DISABLE');
    sendCommand('STOP');
});

client.on('error', function (err) {
    console.error('Connection error: ', err);
    client.end();
});

let intervalId;

function startSendingCommand(command) {
    sendCommand(command);
    intervalId = setInterval(() => sendCommand(command), 100);
}

function stopSendingCommand() {
    clearInterval(intervalId);
    sendCommand('STOP');
}

function sendCommand(command) {
    const topic = 'esp8266/client';
    client.publish(topic, command, { qos: 1, retain: true });
    console.log('Sending:', command);
}

function updateStraightSpeed() {
    const speed = document.getElementById('straightSpeedSlider').value;
    document.getElementById('straightSpeed').innerText = speed;
    sendCommand(`STRAIGHT_SPEED:${speed}`);
}

function updateRotationSpeed() {
    const speed = document.getElementById('rotationSpeedSlider').value;
    document.getElementById('rotationSpeed').innerText = speed;
    sendCommand(`ROTATION_SPEED:${speed}`);
}

function toggleEnable() {
    const button = document.getElementById('enableButton');
    const enabled = button.classList.toggle('active');
    button.innerText = enabled ? 'ON' : 'OFF';
    sendCommand(enabled ? 'ENABLE' : 'DISABLE');
}

// Gán sự kiện cho các nút
document.querySelectorAll('.control-button').forEach(button => {
    const command = button.id.toUpperCase();

    button.addEventListener('mousedown', () => startSendingCommand(command));
    button.addEventListener('mouseup', stopSendingCommand);
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startSendingCommand(command);
    });
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopSendingCommand();
    });
});
