module.exports = getdate;
function getdate(){
let today = new Date();
    var options = {
        weekday: "long",
        month: "long",
        day: "numeric"
    }
    var getDate = today.toLocaleDateString("en-IN",options);
    return getDate;
}