$(()=>{
    
    //Delete User
    $('.deleteUser').click(function(){
        var id = $(this).data('id');
        
        var confirmation = confirm("Are You Sure?");
        
        if(confirmation){
            $.ajax({
                type : "delete",
                url: "/users/delete/"+id,
                success: function(response){
                    window.self.location = "/";
                }
            });
        }else{
            return false;
        }
        
        
    });
});