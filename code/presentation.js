class presentation{
    constructor(){
        this.index=0;
    };
    next(){
        switch(this.index){
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
                
        }
        this.index++;
    }
    report(data){
        console.table(data)
    }

    start() {
        let data = [
            {fonkisyon:"arama",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"tamamlama",bahisQurani:"3 dilde",hasenat:"Yok",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"Sesli",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"Çok Dilde",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"Çok kaynak",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"Seçenekler",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
        ]
        this.report(data)
            

    }
    preference(){
        let data = [
            {fonkisyon:"Tek Satır",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"Tefsirler",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"Diller",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"Renkler",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"Font",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
             ]
             this.report(data)


    }
    search(){
        let x = {
            
        }
    }
    
    
}