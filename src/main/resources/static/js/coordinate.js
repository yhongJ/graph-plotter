    const canvas = document.getElementById("plane")
    const ctx = canvas.getContext("2d"); //그림을 그리는 도구
    canvas.width = 1300;
    canvas.height = 500;
    const LABEL_EVERY = 5; // 5마다 좌표 라벨링


    // 원점은 항상 캔버스 중앙에 고정 (zoom in, out시 격자가 x축, y축에 상관없이 무분별하게 이동하는 것을 막기 위함.
    const ORIGIN_X = canvas.width / 2;   // 650
    const ORIGIN_Y = canvas.height / 2;  // 250

    function gridStep(scale){
        const raw = 50 / scale; // step을 50으로 정해서 zoom, out 을 결정
        const pow = Math.pow(10, Math.floor(Math.log10(raw)))
        // 소수 배 줌이 발생하지 않도록 log scale 내림
        const normalized = raw / pow; // 0 ~ 10 사이에 들어오도록 normalizing
        let step = 0;
        if(normalized < 2) step = 1;
        else if(normalized < 5) step = 2;
        else step = 5;
        return step * pow; //좌표 간격
    }

    function fmt(v) {
        return Number(v.toFixed(6)).toString();   // 0.30000000000000004 방지
    }

    function drawLabels(step, px, iMax, jMax) {

        ctx.font = "13px 'Computer Modern Serif', 'CMU Serif', serif";
        ctx.fillStyle = "#3E3A2A";
        ctx.strokeStyle = "#FFF6C2";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";

        const label = (text, x, y) => {
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        };

        // x축 숫자
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        for (let i = -iMax; i <= iMax; i++) {
            if (i === 0 || i % LABEL_EVERY !== 0) continue;
            const x = ORIGIN_X + i * px;
            if (x < 12 || x > canvas.width - 12) continue;
            label(fmt(i * step), x, ORIGIN_Y + 6);
        }

        // y축 숫자 (캔버스는 아래로 갈수록 y가 커지므로 부호를 뒤집음)
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        for (let j = -jMax; j <= jMax; j++) {
            if (j === 0 || j % LABEL_EVERY !== 0) continue;
            const y = ORIGIN_Y + j * px;
            if (y < 10 || y > canvas.height - 10) continue;
            label(fmt(-j * step), ORIGIN_X - 8, y);
        }

        // 원점
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        label("0", ORIGIN_X - 8, ORIGIN_Y + 6);
    }


    function drawPlane(scale) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 그래프를 지웠을 때 아예 새로그리기 위함.

        const step = gridStep(scale);    // 한 칸이 나타내는 좌표 길이
        const px = step * scale;         // 한 칸의 픽셀 크기

        const iMax = Math.ceil(ORIGIN_X / px);
        const jMax = Math.ceil(ORIGIN_Y / px);
        //격자: 원점(i = 0, j = 0)에서 상하좌우로 뻗어나가도록
        ctx.beginPath();
        ctx.strokeStyle = "#BAD1E6";
        ctx.lineWidth = 1;

        for (let i = -iMax; i <= iMax; i++) {
            const x = Math.round(ORIGIN_X + i * px) + 0.5;   // 선이 흐려지지 않게 0.5
            if (x < 0 || x > canvas.width) continue;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        for (let j = -jMax; j <= jMax; j++) {
            const y = Math.round(ORIGIN_Y + j * px) + 0.5;
            if (y < 0 || y > canvas.height) continue;
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();

        // 축을 맨 나중에 그림
        ctx.beginPath();
        ctx.strokeStyle = "#3E3A2A";
        ctx.lineWidth = 1.4;
        ctx.moveTo(0, ORIGIN_Y + 0.5);
        ctx.lineTo(canvas.width, ORIGIN_Y + 0.5);
        ctx.moveTo(ORIGIN_X + 0.5, 0);
        ctx.lineTo(ORIGIN_X + 0.5, canvas.height);
        ctx.stroke();

        drawLabels(step, px, iMax, jMax);
    }

    drawPlane(50);
