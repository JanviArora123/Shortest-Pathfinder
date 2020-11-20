function ShowHideDiv(weightedAlgo) {
    var dvPassport = document.getElementById("dvPassport");
    dvPassport.style.display = weightedAlgo.checked ? "block" : "none";
}

function ShowHideDiv2(intermediateNodes) {
    if(intermediateNodes.checked)
    {
        document.getElementById('station_setter').removeAttribute("disabled");
    }

    else
    {
        document.getElementById('station_setter').setAttribute("disabled","true");
        states.Context.ActiveGrid.actionMode = states.TOOL_MODE['START_NODE'];
    }
}
