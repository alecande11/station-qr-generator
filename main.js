let isExConnected = false;
let extension, address;


async function connectWallet() {
    const response = await connectToAndReturnWallet().catch((e) => console.error(e));
    address =  response.address;
    document.getElementById('connect-button').setAttribute('value', response.address);
    document.getElementById('download').style.display = 'none';
    if(address){
        document.getElementById('manual-input').style.display = 'none';
        generateQR();
    }
}


async function connectToAndReturnWallet() {
    if (!window.isTerraExtensionAvailable) {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!window.isTerraExtensionAvailable) {
            throw new Error("Terra extension not installed or activated");
        }
    }

    extension = new window.Terra.Extension();
    return new Promise(async resolve => {
        if (!isExConnected) {
            isExConnected = true;
            extension.on("onConnect", resolve);
        }
        return extension.connect();
    });
};

async function generateQR(){
    let addr = address || document.getElementById('address').value;
    let formattedJSON = `{"name":"ledger","address":"${addr}","encrypted_key":"86064ac2525390c7f80f70baaade7c4d5429b4f5786eba8a366134334cd354f4GOe7YuZRzxyccvmGS+XlccuPzwE33I3XvqG5SNPAdQRTzAecPr77NhenT7PH03v4F50+YDZ0uFp9lEtOaMgqW15ihQOGwul4BpfY1+5AOmg="}`;
    let encodedString = btoa(formattedJSON);
    document.getElementById('img').style.display = 'block';
    document.getElementById('qr_text').style.display = 'block';
    
    document.getElementById('qr_link').href = 'https://api.qrserver.com/v1/create-qr-code/?color=000&bgcolor=fff&size=300x300&data=' + encodeURIComponent('terrastation://wallet_recover/?payload=' + encodedString);
    document.getElementById('img').src = 'https://api.qrserver.com/v1/create-qr-code/?color=fff&bgcolor=007ACC&size=250x250&data=' + encodeURIComponent('terrastation://wallet_recover/?payload=' + encodedString);
}