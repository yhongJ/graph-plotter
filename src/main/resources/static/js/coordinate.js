    const canvas = document.getElementById("plane")
    const ctx = canvas.getContext("2d"); //그림을 그리는 도구
    canvas.width = 1300;
    canvas.height = 500;
    const scale = 10;

    ctx.beginPath();

    for(let i = 0; i <= canvas.width/scale; i++) {
        ctx.strokeStyle = "#BAD1E6";
        ctx.moveTo(i * scale, 0);
        ctx.lineTo(i * scale, canvas.height);
    }

    for(let i = 0; i <= canvas.height/scale; i++) {
        ctx.strokeStyle = "#BAD1E6";
        ctx.moveTo(0, i * scale);
        ctx.lineTo(canvas.width, i * scale);

    }
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2)

    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);

    ctx.lineWidth = 3;
    ctx.stroke();
