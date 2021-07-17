(this["webpackJsonpinsider-trading"]=this["webpackJsonpinsider-trading"]||[]).push([[0],{46:function(e,t,a){},48:function(e,t,a){},59:function(e,t,a){"use strict";a.r(t);var s=a(1),r=a.n(s),n=a(26),c=a.n(n),i=(a(46),a(8)),o=a(9),d=a(12),h=a(11),l=a(40),j=a(7),b=(a(47),a(48),a(61)),u=a(62),m=a(39),O=a(63),x=a(65),p=a(64),f=a(66),k=a(67),v=a(0),g=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(e){return Object(i.a)(this,a),t.call(this,e)}return Object(o.a)(a,[{key:"render",value:function(){var e=this,t=[{name:"Dashboard",link:"#dashboard"},{name:"About",link:"#about"}].map((function(t){return t.name===e.props.activeMenuName?Object(v.jsx)(f.a.Link,{href:t.link,active:!0,eventKey:t.name,children:t.name},t.name):Object(v.jsx)(f.a.Link,{href:t.link,eventKey:t.name,children:t.name},t.name)}));return Object(v.jsx)(k.a,{collapseOnSelect:!0,bg:"dark",variant:"dark",expand:"md",fixed:"top",children:Object(v.jsxs)(b.a,{children:[Object(v.jsxs)(k.a.Brand,{href:"#/",children:[Object(v.jsx)("strong",{children:"Insider Trading"}),Object(v.jsx)("sup",{children:"0.1.0"})]}),Object(v.jsx)(k.a.Toggle,{"aria-controls":"basic-navbar-nav"}),Object(v.jsx)(k.a.Collapse,{id:"basic-navbar-nav",children:Object(v.jsx)(f.a,{className:"mr-auto",children:t})})]})})}}]),a}(r.a.Component),y=function(){function e(){Object(i.a)(this,e),this.databaseName="insider-trading",this.databaseName in localStorage||localStorage.setItem(this.databaseName,JSON.stringify({})),this.stocks=JSON.parse(localStorage.getItem(this.databaseName))}return Object(o.a)(e,[{key:"getStockNames",value:function(){return Object.keys(this.stocks)}},{key:"getStockInsiders",value:function(e){return e in this.stocks?Object.keys(this.stocks[e]):[]}},{key:"removeStockInsider",value:function(e,t){e in this.stocks&&(delete this.stocks[e][t],this.persist())}},{key:"removeTransaction",value:function(e,t,a){if(e in this.stocks&&t in this.stocks[e]){for(var s=-1,r=0;r<this.stocks[e][t].length;r++)if(this.stocks[e][t][r]===a){s=r;break}-1!==s&&(this.stocks[e][t].splice(s,1),this.persist())}}},{key:"getInsiderTransactions",value:function(e,t){return e in this.stocks&&t in this.stocks[e]?this.stocks[e][t]:[]}},{key:"deleteStock",value:function(e){delete this.stocks[e],this.persist()}},{key:"addTransaction",value:function(e,t,a,s,r,n){e in this.stocks||(this.stocks[e]={}),t in this.stocks[e]||(this.stocks[e][t]=[]),this.stocks[e][t].push({date:a,shares:s,type:r,price:n}),this.persist()}},{key:"persist",value:function(){localStorage.setItem(this.databaseName,JSON.stringify(this.stocks))}},{key:"saveFromDateFilter",value:function(e){localStorage.setItem(this.databaseName+"-fromDate",e)}},{key:"saveToDateFilter",value:function(e){localStorage.setItem(this.databaseName+"-toDate",e)}},{key:"getFromDateFilter",value:function(){return this.databaseName+"-toDate"in localStorage?localStorage.getItem(this.databaseName+"-toDate"):""}},{key:"getToDateFilter",value:function(){return this.databaseName+"-fromDate"in localStorage?localStorage.getItem(this.databaseName+"-fromDate"):""}},{key:"clearDateFilter",value:function(){delete localStorage[this.databaseName+"-fromDate"],delete localStorage[this.databaseName+"-toDate"]}}]),e}(),C=function(){function e(){Object(i.a)(this,e)}return Object(o.a)(e,null,[{key:"formatWithCommas",value:function(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}},{key:"formatCurrency",value:function(e){return"\u20b1"+e.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}}]),e}(),D=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(e){var s;return Object(i.a)(this,a),(s=t.call(this,e)).database=new y,s.state={fromDate:s.database.getFromDateFilter(),toDate:s.database.getToDateFilter()},s}return Object(o.a)(a,[{key:"handleExportTransactionsClick",value:function(){var e=this,t=null,a=null;""!==this.state.fromDate&&((t=new Date(this.state.fromDate)).setHours(0,0,0,0),t=t.getTime()),""!==this.state.toDate&&((a=new Date(this.state.toDate)).setHours(0,0,0,0),a=a.getTime());var s="Stock,Date,Person,Number of Shares,Trade,Price\n";this.database.getStockNames().forEach((function(r){e.database.getStockInsiders(r).forEach((function(n){e.database.getInsiderTransactions(r,n).forEach((function(e){if(null===t||null===a||e.date>=t&&e.date<=a){var c=new Date(e.date),i=r;i+=","+c.getFullYear()+"-"+(c.getMonth()+1)+"-"+c.getDate(),i+=","+n,i+=","+e.shares,i+=","+e.type,i+=","+e.price,s+=i+"\n"}}))}))}));var r=document.createElement("a");r.download="insider-trading.csv",r.href="data:text/plain;charset=utf-8,"+encodeURIComponent(s),r.click()}},{key:"render",value:function(){var e=this,t=Object(v.jsxs)("tr",{children:[Object(v.jsx)("td",{children:"..."}),Object(v.jsx)("td",{children:"..."}),Object(v.jsx)("td",{children:"..."}),Object(v.jsx)("td",{children:"..."}),Object(v.jsx)("td",{children:"..."})]}),a=this.database.getStockNames();if(a.length>0){var s=null,r=null;""!==this.state.fromDate&&((s=new Date(this.state.fromDate)).setHours(0,0,0,0),s=s.getTime()),""!==this.state.toDate&&((r=new Date(this.state.toDate)).setHours(0,0,0,0),r=r.getTime()),t=a.map((function(t){var a=0,n=0,c=0,i=-1,o=-1;e.database.getStockInsiders(t).forEach((function(d){e.database.getInsiderTransactions(t,d).forEach((function(e){(null===s||null===r||e.date>=s&&e.date<=r)&&("BUY"===e.type?(a+=e.shares,c+=e.shares*e.price,(-1===i||e.price>i)&&(i=e.price),(-1===o||e.price<o)&&(o=e.price)):n+=e.shares)}))})),a<=0&&(i=0,o=0);var d=c/a;return c-=d*n,d=(a-=n)>0?c/a:0,Object(v.jsxs)("tr",{onClick:function(e){window.location.href="#/stock/"+t},children:[Object(v.jsx)("td",{children:Object(v.jsx)("strong",{children:t})}),Object(v.jsx)("td",{children:C.formatCurrency(d)}),Object(v.jsx)("td",{children:C.formatCurrency(i)}),Object(v.jsx)("td",{children:C.formatCurrency(o)}),Object(v.jsx)("td",{children:C.formatWithCommas(a)})]},t)}))}return Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)(g,{activeMenuName:"Dashboard"}),Object(v.jsxs)(b.a,{children:[Object(v.jsx)(u.a,{children:Object(v.jsxs)(m.a,{md:"12",children:[Object(v.jsx)("h2",{children:"Dashboard"}),Object(v.jsxs)("p",{children:[Object(v.jsx)(O.a,{variant:"primary",href:"#/transaction",children:"Add Transaction"})," ",Object(v.jsx)(O.a,{variant:"dark",onClick:function(t){e.handleExportTransactionsClick()},children:"Export to CSV File"})]})]})}),Object(v.jsxs)(u.a,{children:[Object(v.jsx)(m.a,{md:"2",children:Object(v.jsxs)(x.a.Group,{className:"mb-3",children:[Object(v.jsx)(x.a.Text,{className:"text-muted",children:"From Date"}),Object(v.jsx)(x.a.Control,{type:"date",placeholder:"yyyy-mm-dd",value:this.state.fromDate,onChange:function(t){e.database.saveFromDateFilter(t.target.value),e.setState({fromDate:t.target.value})}})]})}),Object(v.jsx)(m.a,{md:"2",children:Object(v.jsxs)(x.a.Group,{className:"mb-3",children:[Object(v.jsx)(x.a.Text,{className:"text-muted",children:"To Date"}),Object(v.jsx)(x.a.Control,{type:"date",placeholder:"yyyy-mm-dd",value:this.state.toDate,onChange:function(t){e.database.saveToDateFilter(t.target.value),e.setState({toDate:t.target.value})}})]})}),Object(v.jsx)(m.a,{md:"2",children:Object(v.jsxs)(x.a.Group,{className:"mb-3",children:[Object(v.jsx)("br",{}),Object(v.jsx)(O.a,{variant:"dark",onClick:function(t){e.database.clearDateFilter(),e.setState({fromDate:"",toDate:""})},children:"Reset"})]})})]}),Object(v.jsx)(u.a,{children:Object(v.jsx)(m.a,{md:"12",children:Object(v.jsxs)(p.a,{responsive:!0,striped:!0,bordered:!0,hover:!0,variant:"dark",children:[Object(v.jsx)("thead",{children:Object(v.jsxs)("tr",{children:[Object(v.jsx)("th",{children:"Stock"}),Object(v.jsx)("th",{children:"Average Cost Per Share"}),Object(v.jsx)("th",{children:"Highest Cost Per Share"}),Object(v.jsx)("th",{children:"Lowest Cost Per Share"}),Object(v.jsx)("th",{children:"Total Insider Shares"})]})}),Object(v.jsx)("tbody",{children:t})]})})})]})]})}}]),a}(r.a.Component),S=a(68),w=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(e){var s;return Object(i.a)(this,a),(s=t.call(this,e)).database=new y,s.state={stock:"",person:"",date:"",shares:"",type:"BUY",price:""},s}return Object(o.a)(a,[{key:"handleAddTransactionClick",value:function(){var e=this.state.stock.trim().toUpperCase(),t=this.state.person.trim().toUpperCase(),a=this.state.date.trim(),s=this.state.shares.trim().toUpperCase(),r=this.state.type.trim().toUpperCase(),n=this.state.price.trim().toUpperCase();if(""!==e&&""!==t&&""!==a&&""!==s&&""!==n&&""!==r)if(a=Date.parse(a),isNaN(a))window.alert("Invalid date.");else if(s=parseInt(s),isNaN(s)||s<=0)window.alert("Shares should be a positive numeric value.");else if(n=parseFloat(n),isNaN(n)||n<=0)window.alert("Price should be a positive decimal value.");else{if("BUY"===r)this.database.addTransaction(e,t,a,s,r,n);else{var c=0;this.database.getInsiderTransactions(e,t).forEach((function(e){"BUY"===e.type?c+=e.shares:c-=e.shares})),(c-=s)<=0?this.database.removeStockInsider(e,t):this.database.addTransaction(e,t,a,s,r,n)}this.setState({stock:"",person:"",date:"",shares:"",price:""}),window.alert("Transaction created.")}else window.alert("All fields are required.")}},{key:"handleImportTransactionsClick",value:function(e){var t=this,a=new FileReader;a.onload=function(){try{var e=0;a.result.split(/\r\n|\n/).forEach((function(a){var s=a.split(",");try{var r=0,n=s[r++].trim().toUpperCase(),c=Date.parse(s[r++].trim()),i=s[r++].trim().toUpperCase(),o=parseInt(s[r++].trim()),d=s[r++].trim().toUpperCase(),h=parseFloat(s[r++].trim());if(""===n||isNaN(c)||""===i||isNaN(o)||o<=0||"BUY"!==d&&"SELL"!==d||isNaN(h)||h<=0)return;t.database.addTransaction(n,i,c,o,d,h),e++}catch(l){}})),e>0&&t.database.getStockNames().forEach((function(e){t.database.getStockInsiders(e).forEach((function(a){var s=0;t.database.getInsiderTransactions(e,a).forEach((function(e){"BUY"===e.type?s+=e.shares:s-=e.shares})),s<=0&&t.database.removeStockInsider(e,a)}))})),window.alert(e+" transactions added."),window.location.href="#/dashboard"}catch(s){console.log(s),window.alert("Invalid file.")}},a.readAsText(e)}},{key:"render",value:function(){var e=this,t=this.database.getStockNames().map((function(e){return Object(v.jsx)("option",{children:e})})),a=this.database.getStockInsiders(this.state.stock).map((function(e){return Object(v.jsx)("option",{children:e})}));return Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)(g,{activeMenuName:"Dashboard"}),Object(v.jsx)(b.a,{children:Object(v.jsxs)(u.a,{children:[Object(v.jsxs)(m.a,{md:"6",children:[Object(v.jsx)("h2",{children:"Add Insider Transaction"}),Object(v.jsxs)(x.a,{children:[Object(v.jsxs)(x.a.Group,{className:"mb-3",children:[Object(v.jsx)(x.a.Label,{children:"Stock"}),Object(v.jsx)(x.a.Control,{list:"stock-names",type:"text",value:this.state.stock,onChange:function(t){e.setState({stock:t.target.value})}}),Object(v.jsx)("datalist",{id:"stock-names",children:t})]}),Object(v.jsxs)(x.a.Group,{className:"mb-3",children:[Object(v.jsx)(x.a.Label,{children:"Person"}),Object(v.jsx)(x.a.Control,{list:"insiders",type:"text",value:this.state.person,onChange:function(t){e.setState({person:t.target.value})}}),Object(v.jsx)("datalist",{id:"insiders",children:a})]}),Object(v.jsxs)(x.a.Group,{className:"mb-3",children:[Object(v.jsx)(x.a.Label,{children:"Date of Transaction"}),Object(v.jsx)(x.a.Control,{type:"date",value:this.state.date,onChange:function(t){e.setState({date:t.target.value})}})]}),Object(v.jsxs)(x.a.Group,{className:"mb-3",children:[Object(v.jsx)(x.a.Label,{children:"Number of Shares"}),Object(v.jsx)(x.a.Control,{type:"number",required:!0,value:this.state.shares,onChange:function(t){e.setState({shares:t.target.value})}})]}),Object(v.jsxs)(x.a.Group,{className:"mb-3",children:[Object(v.jsx)(x.a.Label,{children:"Transaction Type"}),Object(v.jsx)(x.a.Check,{label:"Buy",value:"Buy",name:"transaction-type",type:"radio",checked:"BUY"===this.state.type,onChange:function(t){e.setState({type:"BUY"})}}),Object(v.jsx)(x.a.Check,{label:"Sell",value:"Sell",name:"transaction-type",type:"radio",checked:"SELL"===this.state.type,onChange:function(t){e.setState({type:"SELL"})}})]}),Object(v.jsxs)(x.a.Group,{className:"mb-3",children:[Object(v.jsx)(x.a.Label,{children:"Price Per Share"}),Object(v.jsx)(x.a.Control,{type:"number",step:"any",placeholder:"\u20b1",value:this.state.price,onChange:function(t){e.setState({price:t.target.value})}})]})]}),Object(v.jsxs)("p",{style:{textAlign:"right"},children:[Object(v.jsx)(O.a,{variant:"dark",href:"#/dashboard",children:"Back"})," ",Object(v.jsx)(O.a,{variant:"primary",onClick:function(t){e.handleAddTransactionClick()},children:"Add Transaction"})]})]}),Object(v.jsxs)(m.a,{md:"6",children:[Object(v.jsx)("h2",{children:"or Import Transactions"}),Object(v.jsx)("p",{children:"Select a CSV (Comma Separated Values) file to import. This will not delete your old data but will add more to it. Make sure your CSV file follows the appropriate format (example):"}),Object(v.jsxs)(S.a,{variant:"dark",children:[Object(v.jsx)("strong",{children:"Stock,Date,Person,Number of Shares,Trade,Price"}),Object(v.jsx)("br",{}),"DMC,2021-02-10,MARIA CRISTINA C. GOTIANUN,2599431,BUY,5.56",Object(v.jsx)("br",{}),"DMC,2021-02-10,LUZ CONSUELO A. CONSUNJI,7798292,SELL,5.56 ",Object(v.jsx)("br",{}),"..."]}),Object(v.jsx)(x.a,{children:Object(v.jsx)(x.a.Group,{controlId:"formFile",className:"mb-3",children:Object(v.jsx)(x.a.Control,{type:"file",onChange:function(t){e.handleImportTransactionsClick(t.target.files[0])}})})})]})]})})]})}}]),a}(r.a.Component),N=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(e){var s;if(Object(i.a)(this,a),s=t.call(this,e),!("stock"in e.match.params))throw"Oh snap!";return s.database=new y,s.state={fromDate:s.database.getFromDateFilter(),toDate:s.database.getToDateFilter()},s.stockName=e.match.params.stock,s}return Object(o.a)(a,[{key:"handleDeleteStockClick",value:function(){window.confirm("Are you sure you want to delete this stock?")&&(this.database.deleteStock(this.stockName),window.location.href="#/dashboard")}},{key:"handleExportTransactionsClick",value:function(){var e=this,t=null,a=null;""!==this.state.fromDate&&((t=new Date(this.state.fromDate)).setHours(0,0,0,0),t=t.getTime()),""!==this.state.toDate&&((a=new Date(this.state.toDate)).setHours(0,0,0,0),a=a.getTime());var s="Stock,Date,Person,Number of Shares,Trade,Price\n";this.database.getStockInsiders(this.stockName).forEach((function(r){e.database.getInsiderTransactions(e.stockName,r).forEach((function(n){if(null===t||null===a||n.date>=t&&n.date<=a){var c=new Date(n.date),i=e.stockName;i+=","+c.getFullYear()+"-"+(c.getMonth()+1)+"-"+c.getDate(),i+=","+r,i+=","+n.shares,i+=","+n.type,i+=","+n.price,s+=i+"\n"}}))}));var r=document.createElement("a");r.download=this.stockName.toLowerCase().replace(/[^\w\s]|_/g,"").replace(/\s+/g,"")+"-insider-trading.csv",r.href="data:text/plain;charset=utf-8,"+encodeURIComponent(s),r.click()}},{key:"render",value:function(){var e=this,t=null,a=null;""!==this.state.fromDate&&((t=new Date(this.state.fromDate)).setHours(0,0,0,0),t=t.getTime()),""!==this.state.toDate&&((a=new Date(this.state.toDate)).setHours(0,0,0,0),a=a.getTime());var s=0,r=0,n=0,c=-1,i=-1,o={};this.database.getStockInsiders(this.stockName).forEach((function(d){e.database.getInsiderTransactions(e.stockName,d).forEach((function(e){if(null===t||null===a||e.date>=t&&e.date<=a){d in o||(o[d]={sharesAcquired:0,sharesDisposed:0,totalCost:0,highestSharePrice:-1,lowestSharePrice:-1});var h=o[d];"BUY"===e.type?(s+=e.shares,n+=e.shares*e.price,(-1===c||e.price>c)&&(c=e.price),(-1===i||e.price<i)&&(i=e.price),h.sharesAcquired+=e.shares,h.totalCost+=e.shares*e.price,(-1===h.highestSharePrice||e.price>h.highestSharePrice)&&(h.highestSharePrice=e.price),(-1===h.lowestSharePrice||e.price<h.lowestSharePrice)&&(h.lowestSharePrice=e.price)):(r+=e.shares,h.sharesDisposed+=e.shares)}}))})),s<=0&&(c=0,i=0);var d=n/s;n-=d*r,d=(s-=r)>0?n/s:0;var h=Object.keys(o).map((function(t){var a=o[t],s=a.totalCost/a.sharesAcquired;return a.sharesAcquired-=a.sharesDisposed,a.totalCost-=s*a.sharesDisposed,s=a.sharesAcquired>0?a.totalCost/a.sharesAcquired:0,Object(v.jsxs)("tr",{onClick:function(a){window.location.href="#/insider/"+e.stockName+"/"+t},children:[Object(v.jsx)("td",{children:Object(v.jsx)("strong",{children:t})}),Object(v.jsx)("td",{children:C.formatCurrency(s)}),Object(v.jsx)("td",{children:C.formatCurrency(a.highestSharePrice)}),Object(v.jsx)("td",{children:C.formatCurrency(a.lowestSharePrice)}),Object(v.jsx)("td",{children:C.formatWithCommas(a.sharesAcquired)})]},t)}));return Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)(g,{activeMenuName:"Dashboard"}),Object(v.jsxs)(b.a,{children:[Object(v.jsx)(u.a,{children:Object(v.jsxs)(m.a,{md:"12",children:[Object(v.jsx)("h2",{children:this.stockName}),Object(v.jsxs)("p",{children:[Object(v.jsx)(O.a,{variant:"dark",onClick:function(e){window.location.href="#/dashboard"},children:"Back"})," ",Object(v.jsx)(O.a,{variant:"dark",onClick:function(t){e.handleExportTransactionsClick()},children:"Export to CSV File"})," ",Object(v.jsx)(O.a,{variant:"danger",onClick:function(t){e.handleDeleteStockClick()},children:"Delete Stock"})]})]})}),Object(v.jsxs)(u.a,{children:[Object(v.jsx)(m.a,{md:"2",children:Object(v.jsxs)(x.a.Group,{className:"mb-3",children:[Object(v.jsx)(x.a.Text,{className:"text-muted",children:"From Date"}),Object(v.jsx)(x.a.Control,{type:"date",placeholder:"yyyy-mm-dd",value:this.state.fromDate,onChange:function(t){e.database.saveFromDateFilter(t.target.value),e.setState({fromDate:t.target.value})}})]})}),Object(v.jsx)(m.a,{md:"2",children:Object(v.jsxs)(x.a.Group,{className:"mb-3",children:[Object(v.jsx)(x.a.Text,{className:"text-muted",children:"To Date"}),Object(v.jsx)(x.a.Control,{type:"date",placeholder:"yyyy-mm-dd",value:this.state.toDate,onChange:function(t){e.database.saveToDateFilter(t.target.value),e.setState({toDate:t.target.value})}})]})}),Object(v.jsx)(m.a,{md:"2",children:Object(v.jsxs)(x.a.Group,{className:"mb-3",children:[Object(v.jsx)("br",{}),Object(v.jsx)(O.a,{variant:"dark",onClick:function(t){e.database.clearDateFilter(),e.setState({fromDate:"",toDate:""})},children:"Reset"})]})})]}),Object(v.jsx)(u.a,{children:Object(v.jsxs)(p.a,{responsive:!0,striped:!0,bordered:!0,hover:!0,variant:"dark",children:[Object(v.jsx)("thead",{children:Object(v.jsxs)("tr",{children:[Object(v.jsx)("th",{children:"Average Cost Per Share"}),Object(v.jsx)("th",{children:"Highest Cost Per Share"}),Object(v.jsx)("th",{children:"Lowest Cost Per Share"}),Object(v.jsx)("th",{children:"Total Insider Shares"})]})}),Object(v.jsx)("tbody",{children:Object(v.jsxs)("tr",{children:[Object(v.jsxs)("td",{children:[C.formatCurrency(d)," "]}),Object(v.jsx)("td",{children:C.formatCurrency(c)}),Object(v.jsx)("td",{children:C.formatCurrency(i)}),Object(v.jsx)("td",{children:C.formatWithCommas(s)})]},this.stockName)})]})}),Object(v.jsx)(u.a,{children:Object(v.jsxs)(m.a,{md:"12",children:[Object(v.jsx)("h2",{children:"Insiders"}),Object(v.jsxs)(p.a,{responsive:!0,striped:!0,bordered:!0,hover:!0,variant:"dark",children:[Object(v.jsx)("thead",{children:Object(v.jsxs)("tr",{children:[Object(v.jsx)("th",{children:"Name"}),Object(v.jsx)("th",{children:"Average Cost Per Share"}),Object(v.jsx)("th",{children:"Highest Cost Per Share"}),Object(v.jsx)("th",{children:"Lowest Cost Per Share"}),Object(v.jsx)("th",{children:"Total Shares"})]})}),Object(v.jsx)("tbody",{children:h})]})]})})]})]})}}]),a}(r.a.Component),T=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(e){var s;if(Object(i.a)(this,a),s=t.call(this,e),!("stock"in e.match.params)||!("insider"in e.match.params))throw"Oh snap!";return s.database=new y,s.state={transactions:[],fromDate:s.database.getFromDateFilter(),toDate:s.database.getToDateFilter()},s.stockName=e.match.params.stock,s.insiderName=e.match.params.insider,s}return Object(o.a)(a,[{key:"handleDeleteInsiderClick",value:function(){window.confirm("Are you sure you want to delete this insider?")&&(this.database.removeStockInsider(this.stockName,this.insiderName),window.location.href="#/stock/"+this.stockName)}},{key:"handleTransactionCheckChange",value:function(e,t){var a=this.state.transactions.slice();if(e.target.checked)a.push(t);else{for(var s=-1,r=0;r<a.length;r++)if(a[r]===t){s=r;break}s>=0&&a.splice(s,1)}this.setState({transactions:a})}},{key:"handleDeleteTransactionsClick",value:function(){var e=this;if(0!==this.state.transactions.length&&window.confirm("Are you sure you want to delete the selected transaction(s)?")){if(this.state.transactions.forEach((function(t){e.database.removeTransaction(e.stockName,e.insiderName,t)})),0===this.database.getInsiderTransactions(this.stockName,this.insiderName).length)return this.database.removeStockInsider(this.stockName,this.insiderName),void(window.location.href="#/stock/"+this.stockName);this.setState({transactions:[]})}}},{key:"handleExportTransactionsClick",value:function(){var e=this,t=null,a=null;""!==this.state.fromDate&&((t=new Date(this.state.fromDate)).setHours(0,0,0,0),t=t.getTime()),""!==this.state.toDate&&((a=new Date(this.state.toDate)).setHours(0,0,0,0),a=a.getTime());var s="Stock,Date,Person,Number of Shares,Trade,Price\n";this.database.getInsiderTransactions(this.stockName,this.insiderName).forEach((function(r){if(null===t||null===a||r.date>=t&&r.date<=a){var n=new Date(r.date),c=e.stockName;c+=","+n.getFullYear()+"-"+(n.getMonth()+1)+"-"+n.getDate(),c+=","+e.insiderName,c+=","+r.shares,c+=","+r.type,c+=","+r.price,s+=c+"\n"}}));var r=document.createElement("a");r.download=this.insiderName.toLowerCase().replace(/[^\w\s]|_/g,"").replace(/\s+/g,"")+"-"+this.stockName.toLowerCase().replace(/[^\w\s]|_/g,"").replace(/\s+/g,"")+"-insider-trading.csv",r.href="data:text/plain;charset=utf-8,"+encodeURIComponent(s),r.click()}},{key:"isTransactionChecked",value:function(e){for(var t=0;t<this.state.transactions.length;t++)if(this.state.transactions[t]===e)return!0;return!1}},{key:"render",value:function(){var e=this,t=null,a=null;""!==this.state.fromDate&&((t=new Date(this.state.fromDate)).setHours(0,0,0,0),t=t.getTime()),""!==this.state.toDate&&((a=new Date(this.state.toDate)).setHours(0,0,0,0),a=a.getTime());var s=0,r=0,n=0,c=-1,i=-1,o=this.database.getInsiderTransactions(this.stockName,this.insiderName);o.forEach((function(e){(null===t||null===a||e.date>=t&&e.date<=a)&&("BUY"===e.type?(s+=e.shares,n+=e.shares*e.price,(-1===c||e.price>c)&&(c=e.price),(-1===i||e.price<i)&&(i=e.price)):r+=e.shares)}));var d=n/s;n-=d*r,d=(s-=r)>0?n/s:0,o.sort((function(e,t){return t.date-e.date}));var h=o.map((function(s){if(null===t||null===a||s.date>=t&&s.date<=a){var r=new Date(s.date);return Object(v.jsxs)("tr",{children:[Object(v.jsx)("td",{children:Object(v.jsx)(x.a.Check,{checked:e.isTransactionChecked(s),onChange:function(t){e.handleTransactionCheckChange(t,s)}})}),Object(v.jsxs)("td",{children:[r.getFullYear(),"-",r.getMonth()+1,"-",r.getDate()]}),Object(v.jsx)("td",{children:C.formatWithCommas(s.shares)}),Object(v.jsx)("td",{children:s.type}),Object(v.jsx)("td",{children:C.formatCurrency(s.price)}),Object(v.jsx)("td",{children:C.formatCurrency(s.shares*s.price)})]})}}));return Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)(g,{activeMenuName:"Dashboard"}),Object(v.jsxs)(b.a,{children:[Object(v.jsx)(u.a,{children:Object(v.jsxs)(m.a,{md:"12",children:[Object(v.jsxs)("h2",{children:[this.stockName," / ",this.insiderName]}),Object(v.jsxs)("p",{children:[Object(v.jsx)(O.a,{variant:"dark",onClick:function(t){window.location.href="#/stock/"+e.stockName},children:"Back"})," ",Object(v.jsx)(O.a,{variant:"dark",onClick:function(t){e.handleExportTransactionsClick()},children:"Export to CSV File"})," ",Object(v.jsx)(O.a,{variant:"danger",onClick:function(t){e.handleDeleteInsiderClick()},children:"Delete Insider"})]})]})}),Object(v.jsxs)(u.a,{children:[Object(v.jsx)(m.a,{md:"2",children:Object(v.jsxs)(x.a.Group,{className:"mb-3",children:[Object(v.jsx)(x.a.Text,{className:"text-muted",children:"From Date"}),Object(v.jsx)(x.a.Control,{type:"date",placeholder:"yyyy-mm-dd",value:this.state.fromDate,onChange:function(t){e.database.saveFromDateFilter(t.target.value),e.setState({fromDate:t.target.value})}})]})}),Object(v.jsx)(m.a,{md:"2",children:Object(v.jsxs)(x.a.Group,{className:"mb-3",children:[Object(v.jsx)(x.a.Text,{className:"text-muted",children:"To Date"}),Object(v.jsx)(x.a.Control,{type:"date",placeholder:"yyyy-mm-dd",value:this.state.toDate,onChange:function(t){e.database.saveToDateFilter(t.target.value),e.setState({toDate:t.target.value})}})]})}),Object(v.jsx)(m.a,{md:"2",children:Object(v.jsxs)(x.a.Group,{className:"mb-3",children:[Object(v.jsx)("br",{}),Object(v.jsx)(O.a,{variant:"dark",onClick:function(t){e.database.clearDateFilter(),e.setState({fromDate:"",toDate:""})},children:"Reset"})]})})]}),Object(v.jsx)(u.a,{children:Object(v.jsxs)(p.a,{responsive:!0,striped:!0,bordered:!0,hover:!0,variant:"dark",children:[Object(v.jsx)("thead",{children:Object(v.jsxs)("tr",{children:[Object(v.jsx)("th",{children:"Average Cost Per Share"}),Object(v.jsx)("th",{children:"Highest Cost Per Share"}),Object(v.jsx)("th",{children:"Lowest Cost Per Share"}),Object(v.jsx)("th",{children:"Total Insider Shares"})]})}),Object(v.jsx)("tbody",{children:Object(v.jsxs)("tr",{children:[Object(v.jsx)("td",{children:C.formatCurrency(d)}),Object(v.jsx)("td",{children:C.formatCurrency(c)}),Object(v.jsx)("td",{children:C.formatCurrency(i)}),Object(v.jsx)("td",{children:C.formatWithCommas(s)})]},this.insiderName)})]})}),Object(v.jsx)(u.a,{children:Object(v.jsxs)(m.a,{md:"12",children:[Object(v.jsx)("h2",{children:"Transactions"}),Object(v.jsx)("p",{children:Object(v.jsx)(O.a,{variant:"danger",onClick:function(t){e.handleDeleteTransactionsClick()},children:"Delete Selected Transactions"})}),Object(v.jsxs)(p.a,{responsive:!0,striped:!0,bordered:!0,hover:!0,variant:"dark",children:[Object(v.jsx)("thead",{children:Object(v.jsxs)("tr",{children:[Object(v.jsx)("th",{style:{width:"15px"}}),Object(v.jsx)("th",{children:"Date"}),Object(v.jsx)("th",{children:"Shares"}),Object(v.jsx)("th",{children:"Type"}),Object(v.jsx)("th",{children:"Price Per Share"}),Object(v.jsx)("th",{children:"Market Value"})]})}),Object(v.jsx)("tbody",{children:h})]})]})})]})]})}}]),a}(r.a.Component),I=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(e){return Object(i.a)(this,a),t.call(this,e)}return Object(o.a)(a,[{key:"buyMeACoffee",value:function(){var e=document.createElement("a");e.href="https://www.buymeacoffee.com/it2051229",e.target="_blank",e.click()}},{key:"render",value:function(){var e=this;return Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)(g,{activeMenuName:"About"}),Object(v.jsx)(b.a,{children:Object(v.jsxs)(u.a,{children:[Object(v.jsxs)(m.a,{md:"6",children:[Object(v.jsx)("h3",{children:"Insider Trading Strategy"}),Object(v.jsx)("p",{children:"Insiders are those who work inside the company such as the chairman, directors, treasurers, auditors, and whatnot. They hold first-hand knowledge of what is going on inside the company. When an insider buys their company's share, it only means that they believe that the company is going to do great and that whatever the company is doing now will yield a good financial report. Once the report is published publicly, many investors will put a higher price on the stock because the company's value has increased. Of course, investors who bought earlier at a lower price have now gained profit."}),Object(v.jsx)("h3",{children:"Do you keep my data?"}),Object(v.jsx)("p",{children:"No, all your data are private and locally stored on this web browser. We do not keep your data in our servers. You cannot access your data from another computer or web browser."}),Object(v.jsx)("h3",{children:"Can I keep my data?"}),Object(v.jsx)("p",{children:"Yes, you can export your data. It will be extracted from your computer and downloaded as a file. You can then import the file through using this app from another web browser."})]}),Object(v.jsxs)(m.a,{md:"6",children:[Object(v.jsx)("h3",{children:"Creative Commons License."}),Object(v.jsxs)("p",{children:[Object(v.jsx)("a",{rel:"license",href:"http://creativecommons.org/licenses/by-nc/4.0/",children:Object(v.jsx)("img",{alt:"Creative Commons License",style:{borderWidth:0},src:"https://i.creativecommons.org/l/by-nc/4.0/88x31.png"})}),Object(v.jsx)("br",{}),Object(v.jsx)("span",{xmlnsDct:"http://purl.org/dc/terms/",property:"dct:title",children:"Insider Trading"})," by "," ",Object(v.jsx)("a",{xmlnsCc:"http://creativecommons.org/ns#",href:"https://www.it2051229.com/insidertrading",property:"cc:attributionName",rel:"cc:attributionURL",children:"it2051229"})," is licensed under a",Object(v.jsx)("a",{rel:"license",href:"http://creativecommons.org/licenses/by-nc/4.0/",children:"Creative Commons Attribution-NonCommercial 4.0 International License"}),".",Object(v.jsx)("br",{}),"Based on a work at ",Object(v.jsx)("a",{xmlnsDct:"http://purl.org/dc/terms/",href:"https://github.com/it2051229/it2051229.github.io/tree/master/insider-trading",rel:"dct:source",children:"https://github.com/it2051229/it2051229.github.io/tree/master/insider-trading"}),"."]}),Object(v.jsx)("h3",{children:"Disclaimer"}),Object(v.jsx)("p",{children:"This project is a work in progress but you're using a stable version. There might be changes and improvements anytime so you should use it at your own risk. We recommend to backup your data frequently."}),Object(v.jsx)("p",{children:"If you're a developer feel free to fork our source code but don't forget to give credits."}),Object(v.jsxs)("p",{children:["If you found any issues feel free to shoot us a message at ",Object(v.jsx)("a",{href:"mailto:contact@it2051229.com",children:"contact@it2051229.com"}),"."]}),Object(v.jsx)("p",{children:Object(v.jsx)("center",{children:Object(v.jsx)(O.a,{variant:"primary",onClick:function(t){return e.buyMeACoffee()},children:"Buy me a coffee!"})})})]})]})})]})}}]),a}(r.a.Component),F=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(){return Object(i.a)(this,a),t.apply(this,arguments)}return Object(o.a)(a,[{key:"render",value:function(){return Object(v.jsx)(l.a,{children:Object(v.jsxs)(j.c,{children:[Object(v.jsx)(j.a,{exact:!0,path:"/",component:D}),Object(v.jsx)(j.a,{exact:!0,path:"/dashboard",component:D}),Object(v.jsx)(j.a,{exact:!0,path:"/transaction",component:w}),Object(v.jsx)(j.a,{exact:!0,path:"/stock/:stock",component:N}),Object(v.jsx)(j.a,{exact:!0,path:"/insider/:stock/:insider",component:T}),Object(v.jsx)(j.a,{exact:!0,path:"/about",component:I})]})})}}]),a}(r.a.Component),P=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,69)).then((function(t){var a=t.getCLS,s=t.getFID,r=t.getFCP,n=t.getLCP,c=t.getTTFB;a(e),s(e),r(e),n(e),c(e)}))};c.a.render(Object(v.jsx)(r.a.StrictMode,{children:Object(v.jsx)(F,{})}),document.getElementById("root")),P()}},[[59,1,2]]]);
//# sourceMappingURL=main.b09a96cb.chunk.js.map