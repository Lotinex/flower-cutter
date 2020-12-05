const U = {};

U.createCanvasPath = (ctx, func) => {
    ctx.beginPath()
    func()
    ctx.closePath()
}
U.saveCtxState = (ctx, func) => {
    ctx.save()
    func()
    ctx.restore()
}

U.go = (...funcs) => {
    return (init) => {
        return funcs.reduce((res, func) => func(res), init);
    };
}