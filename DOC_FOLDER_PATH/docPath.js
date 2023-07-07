const fs = require('fs');
class docPath{
    constructor()
    {
        try 
        {
            let folderNames = ["uploads","uploads/po"]
            for(let i = 0; i < folderNames.length; i++)
            {
                if (!fs.existsSync(folderNames[i])) 
                {
                    fs.mkdirSync(folderNames[i]);
                }
            }
        } 
        catch (err) 
        {
            console.error(err);
        } 
    }

    getName(code){
    if (code) 
	{
		switch (code) 
		{
			case 'root': return 'uploads'; 
			case 'po': return 'uploads/po'; 
			default:
				return "unknown folder"
		}
}
    }
}

module.exports = docPath