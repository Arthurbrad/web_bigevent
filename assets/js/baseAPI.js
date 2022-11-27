// ** 每次调用 $.get() | $.post() | $.ajax() 时，会先调用此函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options){
    // 再发起真正的Ajax前，统一拼接请求的路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url)
})