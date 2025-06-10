1. 登录阿里云Docker Registry

$ docker login --username=平头超哥windy crpi-6a105b9464djyzkq.cn-chengdu.personal.cr.aliyuncs.com
用于登录的用户名为阿里云账号全名，密码为开通服务时设置的密码。

您可以在访问凭证页面修改凭证密码。

2. 从Registry中拉取镜像

$ docker pull crpi-6a105b9464djyzkq.cn-chengdu.personal.cr.aliyuncs.com/jasonblog/blog:[镜像版本号]
3. 将镜像推送到Registry

$ docker login --username=平头超哥windy crpi-6a105b9464djyzkq.cn-chengdu.personal.cr.aliyuncs.com
$ docker tag [ImageId] crpi-6a105b9464djyzkq.cn-chengdu.personal.cr.aliyuncs.com/jasonblog/blog:[镜像版本号]
$ docker push crpi-6a105b9464djyzkq.cn-chengdu.personal.cr.aliyuncs.com/jasonblog/blog:[镜像版本号]
