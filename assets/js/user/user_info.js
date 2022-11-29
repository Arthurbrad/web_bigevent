$(function () {
    var form = layui.form
    var layer = layui.layer
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '长度必须在 1 ~ 6 个字符之间'
            }
        }
    })
    initUserInfo()

    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取用户信息失败！')
                }
                console.log(res)
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', function(e){
        // 阻止表单默认行为
        e.preventDefault()
        initUserInfo()
    })


    // 监听表单提交
    $('.layui-form').on('submit', function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res){
                if(res.status != 0){
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                // 调用父页面的方法，重新渲染用户头像和用户信息
                window.parent.getUserInfo()
            }
        })
    })
    // 更新表单基本资料

})
