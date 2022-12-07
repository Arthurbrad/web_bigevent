$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询参数，请求数据时，将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页数据
        pagesize: 2, // 每页显示数据条数， 默认2条
        cate_id: '', // 文章分类ID
        state: '' // 文章发布状态
    }

    initTable()
    initCate()

    // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //  调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                // 调用模板引擎渲染分类可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通知 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新筛选条件，重新渲染表格数据
        initTable()
    })


    // 定义渲染分页的方法
    function renderPage(total) {

        // 调用 laypage.render 方法未渲染分页的结构
        laypage.render({
            elem: 'pageBox' // 注意，pageBox 是 ID，不用加 # 号
            , count: total // 数据总数，从服务端得到
            , limit: q.pagesize // 每页显示几条数据
            , curr: q.pagenum  // 设置默认被选中的分类
            , layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
            , limits: [2, 3, 5, 10]
            // 分页发生切换时触发jump回调
            // 触发 jump 回调的两种方式：1. 点击页码  2. 调用laypage.rander()
            , jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // 把最新页码值,赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数q赋值到这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    // 根据最新的q获取对应的数据列表,并渲染表格
                    initTable()
                }
            }
        });
    }

    // 通过代理方式，为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取文章id
        var id = $(this).attr('data-id')
        // 获取删除按钮个数
        var len = $('.btn-delete').length
        // 询问用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/'+ id,
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    // 当数据删除完成后，判断当前页是否还有剩余数据
                    // 若没有剩余数据，让页码-1
                    if(len == 1){
                        // 若len是 1，证明删除页面后将没有任何数据
                        // 页码值最小为 1
                        q.pagenum = q.pagenum > 1 ? q.pagenum-1 : 1
                    }

                    initTable()
                }
            })

            layer.close(index);
        });
    })
})