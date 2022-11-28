// ** 每次调用 $.get() | $.post() | $.ajax() 时，会先调用此函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 再发起真正的Ajax前，统一拼接请求的路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // 统一为有权限接口 设置请求头
    if (options.url.indexOf('/my/') != -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        // 在 complete 回调函数中可以使用 res.responseJSON 拿到响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1. 强制清空token
            localStorage.removeItem('token')
            // 2. 强制跳转登录页
            location.href = 'login.html'
        }
    }
})