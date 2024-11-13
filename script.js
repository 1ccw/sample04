let randomNumber = Math.floor(Math.random() * 500) + 1;
        let attempts = 0;
        let maxAttempts = 20;

        document.getElementById('submitGuess').addEventListener('click', function() {
            const guess = Number(document.getElementById('guess').value);
            attempts++;
            let resultText = '';
            let attemptsLeft = maxAttempts - attempts;

            if (guess < 1 || guess > 500) {
                resultText = '1부터 500 사이의 숫자를 입력하세요.';
            } else if (guess > randomNumber) {
                resultText = '더 작은 숫자를 시도해 보세요.';
            } else if (guess < randomNumber) {
                resultText = '더 큰 숫자를 시도해 보세요.';
            } else {
                resultText = `축하합니다! ${attempts}번 만에 맞추셨습니다!`;
                document.getElementById('result').innerText = resultText;
                document.getElementById('attemptsLeft').style.display = 'none';  // 남은 횟수 숨김
                document.getElementById('restart').style.display = 'block';
                document.getElementById('submitGuess').disabled = true;
                return;  // 여기서 함수 종료하여 다른 텍스트가 나타나지 않도록 함
            }

            // 힌트 추가
            if (attempts >= 5 && attempts < 10) {
                resultText += ` \n(힌트 : ${randomNumber.toString().length}자리 숫자입니다.)`;
            } else if (attempts >= 10 && attempts < 15) {
                const lastDigit = randomNumber % 10;
                resultText += ` \n(힌트 : 마지막 자리 숫자는 ${lastDigit}입니다.)`;
            } else if (attempts >= 15 && attempts < 20) {
                const secondDigit = Math.floor((randomNumber % 100) / 10);
                resultText += ` \n(힌트 : 두 번째 자리 숫자는 ${secondDigit}입니다.)`;
            }

            if (attemptsLeft > 0 && resultText.includes('시도해 보세요.')) {
                document.getElementById('result').innerText = resultText;
                document.getElementById('attemptsLeft').innerText = `남은 횟수: ${attemptsLeft}`;
            } else if (attemptsLeft === 0 && !resultText.includes('축하합니다!')) {
                resultText = '모든 횟수를 다 사용했습니다. 다시 시도해 보세요!';
                document.getElementById('restart').style.display = 'block';
                document.getElementById('submitGuess').disabled = true;
                document.getElementById('attemptsLeft').innerText = `남은 횟수: 0`;
            }

            document.getElementById('result').innerText = resultText;
        });

        document.getElementById('restart').addEventListener('click', function() {
            randomNumber = Math.floor(Math.random() * 500) + 1;
            attempts = 0;
            document.getElementById('result').innerText = '';
            document.getElementById('guess').value = '';
            document.getElementById('attemptsLeft').innerText = `남은 횟수: ${maxAttempts}`;
            document.getElementById('attemptsLeft').style.display = 'block';  // 남은 횟수 다시 표시
            document.getElementById('restart').style.display = 'none';
            document.getElementById('submitGuess').disabled = false;
        });

let sensorData = {};


if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
        .then(permissionState => {
            if (permissionState === 'granted') {
                window.addEventListener('devicemotion', handleMotionEvent);
                window.addEventListener('deviceorientation', handleOrientationEvent);
            }
        })
        .catch(console.error);
} else {
    window.addEventListener('devicemotion', handleMotionEvent);
    window.addEventListener('deviceorientation', handleOrientationEvent);
}

function handleMotionEvent(event) {
    sensorData.accelerationX = event.accelerationIncludingGravity.x;
    sensorData.accelerationY = event.accelerationIncludingGravity.y;
    sensorData.accelerationZ = event.accelerationIncludingGravity.z;

    console.log("Acceleration with gravity:", sensorData.accelerationX, sensorData.accelerationY, sensorData.accelerationZ);
    sendDataToServer();
}

function handleOrientationEvent(event) {
    sensorData.alpha = event.alpha;
    sensorData.beta = event.beta;
    sensorData.gamma = event.gamma;

    console.log("Orientation:", sensorData.alpha, sensorData.beta, sensorData.gamma);
    sendDataToServer();
}

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", handleOrientationEvent, true);
} else {
    console.log("DeviceOrientationEvent is not supported on this device.");
}



// 서버로 데이터를 보내는 함수
function sendDataToServer() {
    fetch('https://fcda-175-125-49-71.ngrok-free.app/api/sensor-data', { // 서버 엔드포인트 URL로 교체
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sensorData), 
        mode: 'cors'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json()
    })
    .then(data => console.log('Data successfully sent to server:', data))
    .catch(error => console.error('Error sending data to server:', error));
}
