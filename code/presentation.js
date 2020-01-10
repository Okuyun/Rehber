class presentation{
    constructor(){
        this.index=0;
        this.fonkisyon = [this.start,this.aramaTr,this.aramaAr,this.aramaEn,this.preference,this.done]
    };
    next(){
       this.fonkisyon[this.index]();
        this.index++;
    }
    ses(){
    console.log("ilim verilenlere\nبسم الله\n")
    }
    previous(){
        this.index--;
        this.fonkisyon[this.index]();

    }
    report(data){
        console.table(data)
    }
    test(){
        this.fonkisyon[0]();
    }

    start() {
        console.log("have a short explination...")
        let data = [
            {fonkisyon:"arama",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"tamamlama",bahisQurani:"3 dilde",hasenat:"Yok",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"Sesli",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"Çok Dilde",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"Çok kaynak",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"Seçenekler",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
        ]
        new presentation().report(data)
            

    }
    aramaTr(){
        console.log("Türkçe")
        searchQue.value= "örümce"
        loadTransF(5)
        // findAction(searchQue.value)
    }
    aramaAr(){
        console.log("Arapca")
        searchQue.value= "يأكل لحم أخيه"
        loadTransF(5)
        // findAction(searchQue.value)
    }
    aramaEn(){
        console.log("English")
        searchQue.value="nations and tribes"
        loadTransF(4)
        // findAction(searchQue.value)
    }
    preference(){
        console.log("show one by one...")
        let data = [
            {fonkisyon:"Tek Satır",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"Tefsirler",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"Diller",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"Renkler",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            {fonkisyon:"Font",bahisQurani:"3 dilde",hasenat:"1 dilde",KuranMeali:"1 dilde",Quran:"sure isimleri"},
            ]
            new presentation().report(data)


    }
    // https://dev.to/wangonya/better-consolelogs-448c
    done(){
        console.log('%c%s',
            'color: red; background: yellow; font-size: 10vw;','Tesekkurler!')
    }
    
    
    
}

let sunum =  new presentation();
// TODO: colour the verse when you go to iqra...
// TODO: iste - not working LOL even ALLAH you need to check it again.
