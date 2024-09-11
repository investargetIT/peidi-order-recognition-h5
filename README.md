# 基础操作
1. 环境变量，修改`.env`值
```
cp .env.example .env
```
2. 构建镜像
```
./build.sh
```
3. 运行容器
```
./run.sh
```
4. 访问 http://localhost:10086
# 发布
1. 打包编译
```
docker exec peidi-order-recognition-h5 npm run build:h5
```
2. 上传到服务器
```
scp -r dist/* root@example.com:/media/www/peidi-order-recogni
tion-h5
```
