/******** Server-Side Initialization and Moduels, Libraries Required ********/
const express = require('express');
const path = require('path');
const ENV = process.env.ENV || "development";
const bodyParser = require("body-parser");
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const knexLogger = require('knex-logger');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

/******** Public Objects and Arrays ********/
let balanceObj = {};
let allCategories = [];
let allRecords = [];
let balanceChart = {};
let timePeriod = {start: "1000-01-01", end: "9999-12-31"};

/******** Public Functions ********/
// Initialize the top category: balance
function balanceInitialization() {
  balanceObj = {id: 0, parent_id: -1, name:"Balance", type: "category", value: 0, children: []};
  balanceChart = {
    title: "Balance: " + balanceObj.value,
    series: [
      {
        name: "Balance",
        id: "Balance",
        data: [
          { name: "Expenses", y: 0, v: 0, drilldown: 1},
          { name: "Incomes", y: 0, v: 0, drilldown: 2}
        ]
      }
    ],
    drilldown: {
      series: []
    }
  }
}
// If a specific category has record/records inside
function hasRecordIn(categoryObj) {
  let hasRecord = false;
  if(allRecords.length > 0) {
    allRecords.map(record => {
      if(record.category_id === categoryObj.id) {
        hasRecord = true;
      }
    });
  }
  if(!hasRecord) {
    if(allCategories.length > 0) {
      allCategories.map(category => {
        if(category.parent_id === categoryObj.id) {
          if(hasRecord === false) {
            hasRecord = hasRecordIn(category);
          }
        }
      });
    }
  }
  return hasRecord;
}
// Transfer db json style into highcharts data style
function transferToChart() {
  // For the "series" key's value
  let totalExpenses = balanceObj.children[0].value;
  let totalIncomes = balanceObj.children[1].value;
  let totalValue = totalExpenses + totalIncomes;
  balanceChart.series[0].data[0].name = balanceObj.children[0].name;
  balanceChart.series[0].data[1].name = balanceObj.children[1].name;
  balanceChart.series[0].data[0].v = totalExpenses/100;
  balanceChart.series[0].data[1].v = totalIncomes/100;
  balanceChart.series[0].data[0].y = (totalExpenses/totalValue)*100;
  balanceChart.series[0].data[1].y = (totalIncomes/totalValue)*100;
  balanceChart.series[0].data[0].drilldown = balanceObj.children[0].id;
  balanceChart.series[0].data[1].drilldown = balanceObj.children[1].id;
  // For the "drilldown" key's value
  if(allCategories.length > 0) {
    allCategories.map(category => {
      if(hasRecordIn(category)) {
        createSeriesObj(category);
      }
    });
  }
}
// Generate children data for a specific serie (category)
function createChildrenData(categoryObj) {
  let childrenArray = [];
  let childrenObj = {};
  if(allCategories.length > 0) {
    allCategories.map(category => {
      if(category.parent_id === categoryObj.id && hasRecordIn(category)) {
        childrenObj = {}; // Clean child object before a new input
        childrenObj.name = category.name;
        childrenObj.v = category.value/100;
        childrenObj.y = (category.value/categoryObj.value)*100;
        if(categoryObj.children.length > 0) {
          childrenObj.drilldown = category.id;
        } else {
          childrenObj.drilldown = null;
        }
        childrenArray.push(childrenObj);
      }
    });
  }
  if(allRecords.length > 0) {
    allRecords.map(record => {
      if(record.category_id === categoryObj.id) {
        childrenObj = {}; // Clean child object before a new input
        childrenObj.name = record.notes;
        childrenObj.v = record.value/100;
        childrenObj.y = (record.value/categoryObj.value)*100;
        childrenObj.d = record.date.split('T')[0];
        childrenObj.drilldown = null;
        childrenArray.push(childrenObj);
      }
    });
  }
  return childrenArray;
}
// Generate a series for each category and push it into drilldown structure
function createSeriesObj(categoryObj) {
  let seriesObj = {};
  seriesObj.name = categoryObj.name;
  seriesObj.id = categoryObj.id;
  seriesObj.data = createChildrenData(categoryObj);
  balanceChart.drilldown.series.push(seriesObj);
}
// Find all children categories and records for a specific category
function findAllChildren(categoryObj) {
  let children = [];
  if(allCategories.length > 0) {
    allCategories.map(category => {
      if(category.parent_id === categoryObj.id) {
        category.type = "category";
        category.value = 0;
        category.children = findAllChildren(category);
        children.push(category);
      }
    });
  }
  if(allRecords.length > 0) {
    allRecords.map(record => {
      if(record.category_id === categoryObj.id) {
        record.type = "record";
        record.children = [];
        children.push(record);
      }
    });
  }
  return children;
}
// Calculate the value for a specific category based on all the records inside of it
function calculateValue(categoryObj) {
  let valueTotal = 0;
  if(allCategories.length > 0) {
    allCategories.map(category => {
      if(category.parent_id === categoryObj.id) {
        let valueAdd = calculateValue(category);
        category.value += valueAdd;
        if(categoryObj.id === 0 && category.id === 1) {
          valueAdd *= -1;
        }
        valueTotal += valueAdd;
      }
    });
  }
  if(allRecords.length > 0) {
    allRecords.map(record => {
      if(record.category_id === categoryObj.id) {
        valueTotal += record.value;
      }
    });
  }
  return valueTotal;
}
// Update Date Range
function updateDateRange(dateParams) {
  if(Object.keys(dateParams).length > 0) {
    if(dateParams.start){
      timePeriod.start = dateParams.start;
    }
    if(dateParams.end){
      timePeriod.end = dateParams.end;
    }
  }
}
// Initialize Compage Page Relevant Data
let startList = [];
let endList = [];
let columnArray = [];
function compareDateInit() {
  startList = [];
  endList = [];
  columnArray = [];
}
// Update Date Ranges
function updateDateRanges(dateParams) {
  if(Object.keys(dateParams).length > 0) {
    let dateRange = JSON.parse(dateParams.dateRange);
    startList = dateRange.startList;
    endList = dateRange.endList;
    let length = startList.length;
    timePeriod.start = startList[0];
    timePeriod.end = endList[length-1];
  }
}
// Generate Array for column chart
function createColumnArray () {
  let columnObj = {};
  if(allCategories.length > 0) {
    allCategories.map(category => {
      columnObj = {};
      columnObj.cid = category.id;
      columnObj.rid = -1;
      columnObj.pid = category.parent_id;
      columnObj.name = category.name;
      columnObj.type = 1; // Category
      columnObj.data = [];
      for(let i = 0; i < startList.length; i ++) {
        columnObj.data.push(0);
      }
      columnArray.push(columnObj);
    });
  }
  if(allRecords.length > 0) {
    allRecords.map(record => {
      columnObj = {};
      columnObj.cid = -1;
      columnObj.rid = record.id;
      columnObj.pid = record.category_id;
      columnObj.name = record.notes;
      columnObj.type = 2; // Record
      columnObj.data = [];
      let recordDate = record.date.split('T')[0];
      for(let i = 0; i < startList.length; i ++) {
        if(recordDate < startList[i] || recordDate > endList[i]) {
          columnObj.data.push(0);
        } else {
          columnObj.data.push(record.value/100);
        }
      }
      columnArray.push(columnObj);
    });
  }
}
// Calculate value for each category in colunm array for column chart
function getCategoryValuForColunm(columnObj, timeID){
  let valueTotal = 0;
  let length = columnArray.length;
  for(let i = 1; i < length; i ++) {
    // For Category
    if(columnArray[i].type === 1) {
      // Find Children
      if(columnArray[i].pid === columnObj.cid) {
        let value = getCategoryValuForColunm(columnArray[i], timeID);
        columnArray[i].data[timeID] += value;
        if(columnArray[i].cid === 1) { // Category "Expenses"
          valueTotal -= value;
        } else {
          valueTotal += value;
        }
      }
    }
    // For Record
    if(columnArray[i].type === 2) {
      // Find Children
      if(columnArray[i].pid === columnObj.cid) {
        let value = columnArray[i].data[timeID];
        valueTotal += value;
      }
    }
  }
  return valueTotal;
}

/******** All HTTP Requires Based On Express ********/
// Home Page: Achieve data from DB, regulate into hightchart style, and then send back to the front
app.get('/Home', (req,res) => {
  // Update Date Range
  updateDateRange(req.query);

  // Select all Categories
  knex('categories').select()
  .then(categories => {
    return Promise.all(JSON.parse(JSON.stringify(categories)));
  })
  .then(results => {
    allCategories = results;

    // Select all Records
    knex('records').select().where('date', '>=', timePeriod.start).andWhere('date', '<=', timePeriod.end)

    .then(records => {
      allRecords = JSON.parse(JSON.stringify(records));
      balanceInitialization();
      balanceObj.children = findAllChildren(balanceObj);
      balanceObj.value += calculateValue(balanceObj);
      transferToChart();
      balanceChart.title = "Balance: $" + balanceObj.value/100;
      res.json(balanceChart);
    })
    .catch(err => console.error(err));
  })
  .catch(err => console.error(err));
});

// Tracking Page:
app.get('/Tracking', (req,res) => {
  // console.log("app.get >>> Compare Page = ", req.query);
  compareDateInit();
  // Update Date Range
  updateDateRanges(req.query);
  // Select all Categories
  knex('categories').select()
  .then(categories => {
    return Promise.all(JSON.parse(JSON.stringify(categories)));
  })
  .then(results => {
    allCategories = results;

    // Select all Records
    knex('records').select().where('date', '>=', timePeriod.start).andWhere('date', '<=', timePeriod.end)

    .then(records => {
      // Generate data for the pie chart in compare page
      allRecords = JSON.parse(JSON.stringify(records));
      balanceInitialization();
      balanceObj.children = findAllChildren(balanceObj);
      balanceObj.value += calculateValue(balanceObj);
      transferToChart();
      balanceChart.title = "Balance: $" + balanceObj.value/100;

      // Generate data for the column chart in compare page
      if(startList.length <= 0 || endList.length <= 0) {
        console.log("BS >>> app.get(Compare) no start or end time list");
      } else {
        let columnObj = {};
        columnObj = {};
        columnObj.cid = 0;
        columnObj.rid = -1;
        columnObj.pid = -1;
        columnObj.name = "Balance";
        columnObj.type = 1; // Category
        columnObj.data = [];
        for(let i = 0; i < startList.length; i ++) {
          columnObj.data.push(0);
        }
        columnArray.push(columnObj);
        createColumnArray();
        
        for(let j = 0; j < startList.length; j ++) {
          columnArray[0].data[j] += getCategoryValuForColunm(columnArray[0], j);
        }

        let result = { pie: balanceChart, column: columnArray};
        res.json(result);
      }
    })
    .catch(err => console.error(err));
  })
  .catch(err => console.error(err));

});

// Categories Management Page:
app.get('/api/getCategories', (req,res) => {
  knex.select().from('categories')
  .then((results) => {
    res.json({
      data: results
    });
  });
});

app.get('/api/getRecords', (req,res) => {
  knex.select().from('records')
      .then((results) => {
        res.json({
          data: results
        });
      })
});

app.get('/api/getCategoriesMenu', (req, res) => {
  knex.select().from('categories')
  .then((results) => {
    res.json({ data: results });
  })
});

/******** Management Page Relevant ********/
app.get('/GetSubCategories', (req,res) => {
  knex.select().from('categories').where({parent_id: req.query.parent_id})
  .then((results) => {
    let categories = results;
    if(req.query.start === "" || req.query.end === "") {  // Show All Records
      knex.select().from('records').where({category_id: req.query.parent_id}).orderBy(req.query.orderBy, req.query.orderType)
      .then((results) => {
        let records = results;
        res.json({ categories: categories, records: records });
      })
      .catch(err => console.error(err));
    } else {  // Show Records based on the date filter
      knex.select().from('records').where({category_id: req.query.parent_id}).orderBy(req.query.orderBy, req.query.orderType)
      .andWhere('date', '>=', req.query.start).andWhere('date', '<=', req.query.end)
      .then((results) => {
        let records = results;
        res.json({ categories: categories, records: records });
      })
      .catch(err => console.error(err));
    }
  });
});

app.get('/GetParentCategory', (req,res) => {
  knex.select().from('categories').where({id: req.query.id})
  .then((results) => {
    let parentID = results[0].parent_id;
    knex.select().from('categories').where({id: parentID})
    .then((results) => {
      res.json({ results });
    })
    .catch(err => console.error(err));
  });
});

app.post('/NewCategory', (req,res) => {
  knex('categories').insert([{name: req.body.newCat.name, parent_id: req.body.newCat.parent_id}]).then(result =>
    {res.json(result)})
});

app.post('/NewRecord', (req,res) => {
  let record = {
    user_id: 1,
    category_id: req.body.newRec.category_id,
    value: req.body.newRec.value,
    date: req.body.newRec.date,
    notes: req.body.newRec.notes,
  };
  knex('records').insert([record])
  .then(result => {
    res.json(result);
  })
  .catch(err => console.error(err));
});

app.post('/EditCategory', (req, res) => {
  knex('categories').where({id: req.body.editCat.id}).update({name: req.body.editCat.name, notes:req.body.editCat.notes})
  .then(result => {
    res.json(result)
  })
  .catch(err => console.error(err));
});

app.post('/EditRecord', (req, res) => {
  knex('records').where({id: req.body.editRecord.id})
  .update({value: req.body.editRecord.value, date:req.body.editRecord.date, notes: req.body.editRecord.notes})
  .then(result => {
    res.json(result);
  })
  .catch(err => console.error(err));
});

app.post('/CutCategory', (req, res) => {
  knex('categories').where({id: req.body.cutCat.id}).update({parent_id: req.body.cutCat.parent_id})
  .then(result => {
    res.json(result)
  })
  .catch(err => console.error(err));
});

app.post('/CutRecord', (req, res) => {
  knex('records').where({id: req.body.cutRec.id}).update({category_id: req.body.cutRec.category_id})
  .then(result => {
    res.json(result);
  })
  .catch(err => console.error(err));
});

// Get All Categories need to be removed
let categoriesRemove = [];
function removeCategory(parent_id) {
  categoriesRemove.push(parent_id);
  if(allCategories.length > 0) {
    allCategories.map(category => {
      if(category.parent_id === parent_id) {
        removeCategory(category.id);
      }
    });
  }
  removeRecord(parent_id);
}

// Get All Records need to be removed
let recordsRemove = [];
function removeRecord(category_id) {
  if(allRecords.length > 0) {
    allRecords.map(record => {
      if(record.category_id === category_id) {
        recordsRemove.push(record.id);
      }
    });
  }
}

app.post('/DeleteCategory', (req, res) => {
  categoriesRemove = [];
  let categoryDeleteId = req.body.delCategory.id;
  knex('categories').select()
  .then(categories => {
    return Promise.all(JSON.parse(JSON.stringify(categories)));
  })
  .then(results => {
    allCategories = results;

    // Select all Records
    knex('records').select()
    .then(records => {
      allRecords = JSON.parse(JSON.stringify(records));

      categoriesRemove = [];
      removeCategory(categoryDeleteId);

      if(recordsRemove.length > 0) {
        knex('records').whereIn('id', recordsRemove).del()
        .then(result => {
           knex('categories').whereIn('id', categoriesRemove).del()
          .then(result => {
             res.json('categories delete successed');
          })
          .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
      } else {
        knex('categories').whereIn('id', categoriesRemove).del()
        .then(result => {
           res.json('delete successes');
        })
        .catch(err => console.error(err));
      }
    })
    .catch(err => console.error(err));
  })
  .catch(err => console.error(err));
});

app.post('/DeleteRecord', (req, res) => {
  recordsRemove = [];
  knex('records').where({id: req.body.delRecord.id}).del()
  .then(result =>{
    res.json(result);
  });
});

app.get('*', (req,res) =>{
	res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

/******** Start Listening ********/
const port = process.env.PORT || 5000;
app.listen(port);
console.log('BS >>> App is listening on port ' + port);