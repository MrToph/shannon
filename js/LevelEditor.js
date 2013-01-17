Game.LevelEditor = new Class({
    initialize: function(initGraphRepresentation){
        this.stringRepresentation = initGraphRepresentation;
        this.initDOM();
    },
    
    initDOM: function(){
               // get the reference for the body
        var mybody = document.getElementsByTagName("body")[0];
        var container = document.createElement("div");
        
        var arr = this.stringRepresentation.split(";");
        if(arr.length < 1){
            return false;
        }
        this.dim = parseInt(arr[0],10);
        
        var txt = document.createTextNode("Amount of nodes:");
        container.appendChild(txt);
        
        var edit = document.createElement("input");
        edit.setAttribute("type", "text");
        edit.setAttribute("value", this.dim.toString());
        edit.setAttribute("id", "amountVertices");
        edit.setAttribute("maxLength", "2");
        edit.setAttribute("size", "1");
        edit.onchange = this.amountVerticesChanged.bind(this);
        container.appendChild(edit);
        
        var btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "Create level");
        btn.setAttribute("id", "btnOK");
        btn.onclick = this.createClick.bind(this);
        container.appendChild(btn);
        
        var mytable = this.createTable(arr);
        mytable.setAttribute("border","1");
        
        container.appendChild(mytable);
        mybody.appendChild(container);
        
        container.style.position = 'absolute';
        //container.style.width = (400).toString() + 'px'; container.style.height = (200).toString() + 'px';
        container.style.top = ((window.innerHeight - parseInt(container.style.height, 10))/2).toString() + 'px';
        container.style.left = 0;
        container.style.top = 0;
        this.container = container;
    },
    
    amountVerticesChanged: function(){
        console.log(this);
        var amountVerticesEdit = this.container.getElementById("amountVertices");
        var dim = parseInt(amountVerticesEdit.value, 10);
        if(isNaN(dim) || dim > Game.MAXVERTICES ){
            return;
        }
        this.dim = dim;

        var table = this.container.getElementsByTagName("table")[0];
        if(table){
            this.container.removeChild(table);
        }
        
        var arr = new Array(((dim+1)*dim)/2 - dim + 1);     // upper triangle size without the diagonal; +1 because we need dim in arr[0]
        for(var i = 0, l = arr.length; i < l; i++){
            arr[i] = 0;
        }
        arr[0] = dim;
        
        // build table
        var mytable = this.createTable(arr);
        mytable.setAttribute("border","1");
        
        this.container.appendChild(mytable);
    },
    
    createClick: function(){
        var dim = this.dim;
        var l = ((dim+1)*dim)/2 - dim;
        var arr = new Array(l+1);
        arr[0] = dim;
        for(var i = 1; i < l+1; i++){
            var bla = document.id("edit" + i.toString());
            arr[i] = parseInt(document.id("edit" + i.toString()).value, 10);
        }
        // remove the UI
        var mybody = document.getElementsByTagName("body")[0];
        mybody.removeChild(this.container);
        
        var s = arr.join(";");
        window.location.hash = s;
    },
    
    createTable: function(arr){
        // creates <table> and <tbody> elements
        var mytable     = document.createElement("table");
        var mytablebody = document.createElement("tbody");
        
        var dim = parseInt(arr[0], 10);
        if((arr.length-1) != ((dim+1)*dim)/2 - dim){     // symmetric and no diagonal (-dim)
            dim = 0;
        }
 
        var c = 1;
        // creating all cells
        for(var j = 0; j < dim+1; j++) {
            // creates a <tr> element
            var mycurrent_row = document.createElement("tr");
 
            for(var i = 0; i < dim+1; i++) {
                // creates a <td> element
                var mycurrent_cell = document.createElement("td");
                
                if(j === 0){    // first row
                    if(i >= 1){
                        currenttext = document.createTextNode(i.toString());
                        mycurrent_cell.appendChild(currenttext);
                    }
                }
                else if(i === 0){   // first col
                    if(j >= 1){
                        currenttext = document.createTextNode(j.toString());
                        mycurrent_cell.appendChild(currenttext);
                    }
                }
                else{
                    if(i > j){
                        var edit = document.createElement("input");
                        edit.setAttribute("type", "text");
                        edit.setAttribute("value", parseInt(arr[c], 10).toString());
                        edit.setAttribute("id", "edit" + c.toString());
                        edit.setAttribute("maxLength", "2");
                        edit.setAttribute("size", "1");
                        c++;
                        
                        // appends the Text Node we created into the cell <td>
                        mycurrent_cell.appendChild(edit);
                    }
                }
                
                
                
                // appends the cell <td> into the row <tr>
                mycurrent_row.appendChild(mycurrent_cell);
            }
            // appends the row <tr> into <tbody>
            mytablebody.appendChild(mycurrent_row);
        }
        
        // appends <tbody> into <table>
        mytable.appendChild(mytablebody);
        return mytable;
    }
    
});
