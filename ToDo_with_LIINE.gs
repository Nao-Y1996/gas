const AnswerSheet = SpreadsheetApp.openById('').getSheetByName('フォームの回答 1');
const TaskSheet = SpreadsheetApp.openById('').getSheetByName('シート1');
const Form = FormApp.openById('');
const form_url = '';
const LINE_TOKEN = '';


function sample(){
  // シートの最後の行を取得する
  let lastRow = TaskSheet.getLastRow();
  console.log(lastRow);

  // シートの特定の範囲の情報を取得する
  let values = TaskSheet.getRange(2, 1, 1, 2).getValues()[0];
  console.log(values);

}



function UpdateTasks() {

  // 【コードを書いてみよう1】フォームから送られてきた最新情報を読み取る
  //
  //
  let values = AnswerSheet.getRange(lastRow, 2, 1, 4).getValues()[0];// [操作, 新規タスク, 締め切り, 完了タスク]
  console.log('フォームからの最新情報\n' + values);
  
  // 【コードを書いてみよう2】操作が「タスクの作成」の時
  if ( /*ここに条件をいれる*/ ){
    
    // 最後の行+1行目に、タスク情報を書き込む
    let task_lastRow = TaskSheet.getLastRow();
    let task_info = [[values[1].trim(), Utilities.formatDate(values[2],"JST", "MM/dd (HH:mm)")]];
    TaskSheet.getRange(task_lastRow+1, 1, 1, 2).setValues(task_info);
    console.log('タスク一覧に書き込む内容\n'+task_info);

    // タスクを締め切り順に並び替える
    task_lastRow = TaskSheet.getLastRow();
    let data = TaskSheet.getRange(2, 1, task_lastRow, 2);
    data.sort({column: 2, ascending: true});
      
  }
  // 【コードを書いてみよう3】操作が「タスクの完了」の時
  if (/*ここに条件をいれる*/){

    // 削除したいタスク
    let task = values[3];
    console.log('削除したいタスク\n' + task);

    if (task == 'タスクはありません'){
      // 削除したいタスクが「タスクはありません」のときは終了
      console.log('「タスクはありません」が送信されました。')
      return
    }else{
      // 【コードを書いてみよう4】タスクの一覧を取得する
      //
      //
      
      // タスク一覧から、削除したいタスクを探して、タスク一覧シートから消す行を決める
      let rowForDelete = task_list.indexOf(task) + 2;
      
      // 削除する
      if (rowForDelete != 1){
        console.log('削除する行\n' + rowForDelete);
        TaskSheet.deleteRows(rowForDelete);
      }else{
        console.log('タスク一覧に、削除したいタスクがありません')
      }
    }
  }
}

function UpdateForm(){
  // Googleフォームの更新
  let task_lastRow = TaskSheet.getLastRow();
  let items = Form.getItems();
  let item = items[5];
  let choices;

  // 選択肢の設定
  try{
    // 【コードを書いてみよう5】タスクを取得する
    //
  }catch(error){
    choices = ['タスクはありません']
  }
  // 重複タスクが追加されたときはそのタスクを消してプログラム終了
  try{
    item.asListItem().setChoiceValues(choices);
  }catch(error){
    console.log('重複するタスクが追加されたのでプログラムを終了しました。');
    TaskSheet.deleteRows(task_lastRow);
    return
  }
  
  console.log(choices);
}

function LINE_Notify(){
  let task_lastRow = TaskSheet.getLastRow();
  try{
    var task_list = TaskSheet.getRange(2, 1, task_lastRow-1, 1).getValues().flat();
    var deadline_list = TaskSheet.getRange(2, 2, task_lastRow-1, 1).getValues().flat();
  }catch(error){
    var task_list = ['タスクはありません'];
    var deadline_list = [''];
  };
 
  let i=0;
  let message ='\n\n---------------------------------------------------------------';
  for (let task of task_list){
    message += "\n\n■"+task + "\n　" + deadline_list[i]; 
    i += 1;
  }
  message +='\n---------------------------------------------------------------\n\n';
  message += '\n\n'+form_url;
  console.log('通知メッセージ\n' + message);

  //　LINEに送信する
  PropertiesService.getScriptProperties().setProperty("LINE_TOKEN",LINE_TOKEN );
  let token = PropertiesService.getScriptProperties().getProperty("LINE_TOKEN");
  let op =
    {
      "method" : "post",
      "Content-Type" : "application/x-www-form-urlencoded",
      "payload": "message=" + message,
      "headers":{"Authorization" : "Bearer " + token}
    };
  let res = UrlFetchApp.fetch("https://notify-api.line.me/api/notify",op);
  Logger.log(JSON.parse(res.getContentText())); //Response
  
}

function main(){
  UpdateTasks();
  UpdateForm();
  LINE_Notify();
}
