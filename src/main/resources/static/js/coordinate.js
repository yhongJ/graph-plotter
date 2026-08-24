    const canvas = document.getElementById("plane")
    const ctx = canvas.getContext("2d"); //그림을 그리는 도구
    canvas.width = 800;
    canvas.height = 500;
    const scale = 10;

    ctx.beginPath();

    for(let i = 0; i <= 80; i++) {
        ctx.strokeStyle = "#BAD1E6";
        ctx.moveTo(i * scale, 0);
        ctx.lineTo(i * scale, 500);
    }

    for(let i = 0; i <= 80; i++) {
        ctx.strokeStyle = "#BAD1E6";
        ctx.moveTo(0, i * scale);
        ctx.lineTo(800, i * scale);

    }
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(0, 250);
    ctx.lineTo(800, 250)

    ctx.moveTo(400, 0);
    ctx.lineTo(400, 500);

    ctx.lineWidth = 3;
    ctx.stroke();
