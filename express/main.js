const express = require('express') // const는 바뀌지 않는다. 앞으로는 express 이름의 값은 다른 걸로 바꾸지 않도록 고정을 시킨 것
const app = express()// express 함수처럼 불러 온다.
const fs = require('fs');
const bodyParser = require('body-parser');
const template = require('./lib/template.js');
const compression = require('compression');
const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');
const halmet = require('helmet');
app.use(helmet());

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false})); // 원리 복잡
app.use(compression());
app.get('*',function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);

//express는 순서대로 진행하므로, 마지막까지 왔을때 못찾으면 에러 표시
app.use(function(req, res, next){
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));