var all_item_list = getList('partsList', 2, 2, 3);
var class_list = getList('partsList', 2, 11, 1);
var key_list = getList('partsList', 2, 6, 2);
var all_students_list = getList('販売リスト', 2, 1, 2);

function onEdit(e)
{
  //違うシートを編集していたらreturnする
  if(SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName() !=='検索用')return;
  
  //変更されたセルによって処理を分岐
  if(changedCell(e, 'category'))
  {
    setList(getItemList(e.value), 'B3');
  }
  else if(changedCell(e, 'parts'))
  {
    price = setPartsPrice(e.value);
    PropertiesService.getScriptProperties().setProperty('current_parts', e.value);
    PropertiesService.getScriptProperties().setProperty('current_parts_price', price);
    setList(class_list, 'B7');
  }
  else if(changedCell(e, 'room'))
  {
    setList(getFilteredItemList(e.value, all_students_list),'B9');
  }
  else if(changedCell(e, 'student'))
  {
    PropertiesService.getScriptProperties().setProperty('current_student', e.value);
    setList(['上記の設定で登録する場合は「登録」を選択してください。','登録'],'B11');
    setRegistDefault();
  }
  else if(changedCell(e, 'regist'))
  {
    if(e.value=='登録')
      setSalesHistory(PropertiesService.getScriptProperties().getProperty('current_student'));
  }
  else
    Logger.log('no action');
}


//引数に指定した項目が変更されたかチェック
function changedCell(e, check_cell_name)
{
  check_category = {'category':1, 'parts':3, 'room':7, 'student':9, 'regist':11 }
  return e.range.rowEnd == check_category[check_cell_name] && e.range.columnEnd == 2;
}

//指定の位置に、渡したpulldownリストをセットする  
function setList(item_list, setIndex){ 
  clearValUnder(setIndex);
  
  var rng = SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName('検索用')
  .setActiveSelection(setIndex);

  var rule = SpreadsheetApp
  .newDataValidation()
  .requireValueInList(item_list,true)
  .build();
  
  rng.setDataValidation(rule);
}

//選択されたパーツの値段をセットする
function setPartsPrice(parts_name)
{
  var price = searchPartsPrice(parts_name);
  
  SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName('検索用')
  .getRange('B5')
  .setValue(price + ' 円');
  
  return price;
}

function setRegistDefault()
{
  SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName('検索用')
  .getRange('B11')
  .setValue('上記の設定で登録する場合は「登録」を選択してください。');  
}

//パーツの値段をリストから取得
function searchPartsPrice(parts_name)
{
  for(var i = 0;i<all_item_list.length;i++)
    if(all_item_list[i][1]===parts_name) return all_item_list[i][2];
}

//販売履歴を生徒ごとの行の最終列に追加する
function setSalesHistory(name)
{
  studentIndex = getSoldStudentIndex(name);
  var today = Utilities.formatDate(new Date(), "JST", "yyyy.MM.dd");  
  var current_parts_price = PropertiesService.getScriptProperties().getProperty('current_parts_price');
  var current_parts = PropertiesService.getScriptProperties().getProperty('current_parts');
  var num_of_columns = SpreadsheetApp.getActiveSpreadsheet()
  .getSheetByName('販売リスト')
  .getRange(studentIndex, 1)
  .getNextDataCell(SpreadsheetApp.Direction.NEXT)
  .getColumn();
  
  SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName('販売リスト')
  .getRange(studentIndex, num_of_columns+1)
  .setValue(today+' '+Math.floor(current_parts_price)+'円 '+current_parts);
  
  clearValUnder('B1');
  propertyReset();
}

function getSoldStudentIndex(name)
{
  for(var i=0 ; i<all_students_list.length ; i++)
    if(all_students_list[i][1]==name)return i+2;
}

//パーツのリストを作成
function getItemList(category)
{
  var key = getKey(category, key_list);
  return getFilteredItemList(key, all_item_list);
}

function getKey(category, key_list)
{
  for(var i = 0;i<key_list.length;i++)
    if(key_list[i][0]===category) return key_list[i][1];
}

function getFilteredItemList(key, all_item_list)
{
  var list = [];
  for(var i = 0; i < all_item_list.length; i++)
    if(all_item_list[i][0] === key) list.push(all_item_list[i][1]);
  
  return list;
}

//指定シート、指定セルから、指定列数分、最終行までデータを取得
function getList(sheet_name, first_cell_row_num, first_cell_column_num, num_of_columns)
{
  var num_of_rows = SpreadsheetApp.getActiveSpreadsheet()
  .getSheetByName(sheet_name)
  .getRange(first_cell_row_num, first_cell_column_num)
  .getNextDataCell(SpreadsheetApp.Direction.DOWN)
  .getRow();
  
   return SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName(sheet_name)
  .getRange(first_cell_row_num, first_cell_column_num, num_of_rows - 1, num_of_columns)
  .getValues();
}

//指定したセルより下にある、入力済みの値を削除
function clearValUnder(index)
{
  SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName('検索用')
  .getRange(index+':B11')
  .clearContent();
}

function propertyReset()
{
  PropertiesService.getScriptProperties().setProperty('current_parts', 'NULL');
  PropertiesService.getScriptProperties().setProperty('current_parts_price', 'NULL');
  PropertiesService.getScriptProperties().setProperty('current_student', 'NULL');
}


/*
+------+
|注意点 |
+------+
販売リストやpartsListのシートについて、「A列」や「B列」を指定してスクリプトを動かしているので、
列を追加したりずらしてしまうと動かなくなる
”縦方向（生徒やパーツ、教室名）の追加は大丈夫。”

販売記録の追加は、
1. 生徒を選択
2. 生徒名の行をチェックして、データが入っていない一番右のセルにデータを入れる
という仕様になっているので、間に空白のセルが存在するとうまく動作しない可能性がある。
販売記録のデータを消す場合は、セル内のデータを消すのではなく、”セルごと削除して、左に詰める”。

*/
