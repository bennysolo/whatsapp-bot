const { default: got } = require('got/dist/source');
const fetch = require('node-fetch')
const { getBase64 } = require("./fetcher")
const request = require('request')
const emoji = require('emoji-regex')
const FormData = require('form-data')
const { fromBuffer } = require('file-type')
const resizeImage = require('./imageProcessing')
const fs = require('fs-extra')
const moment = require('moment-timezone')
const vhtear = 'IyaTenangAja'
moment.tz.setDefault('Asia/Jakarta').locale('id')

const liriklagu = async (lagu) => {
    const response = await fetch(`http://scrap.terhambar.com/lirik?word=${lagu}`)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
    const json = await response.json()
    if (json.status === true) return `Lirik Lagu ${lagu}\n\n${json.result.lirik}`
    return `[ Error ] Lirik Lagu ${lagu} tidak di temukan!`
}

const stickerburn = (imageUrl) => new Promise((resolve, reject) => {
    fetch('https://api.vhtear.com/burning_fire?link=' + encodeURIComponent(imageUrl) + '&apikey=' + vhtear, {
            method: 'GET',
        })
        .then(async res => {
            const text = await res.json()

            resolve(text)

        })
        .catch(err => reject(err))
});

const bikinmeme = (imageUrl) => new Promise((resolve, reject) => {
    fetch('https://api.vhtear.com/genmeme?text1=aku&text2=ganteng&url=' + encodeURIComponent(imageUrl) + '&apikey=' + vhtear, {
            method: 'GET',
        })
        .then(async res => {
            const textt = await res.json()

            resolve(textt)

        })
        .catch(err => reject(err))
});

const stickertrigger = (imageUrl) => new Promise((resolve, reject) => {
    'https://api.zeks.xyz/api/triger?apikey=apivinz&img=' + encodeURIComponent(imageUrl)
        .catch(err => reject(err))
});

const uploadImages = (buffData, type) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async(resolve, reject) => {
        const { ext } = await fromBuffer(buffData)
        const filePath = 'utils/tmp.' + ext
        const _buffData = type ? await resizeImage(buffData, false) : buffData
        fs.writeFile(filePath, _buffData, { encoding: 'base64' }, (err) => {
            if (err) return reject(err)
            console.log('Uploading image to telegra.ph server...')
            const fileData = fs.readFileSync(filePath)
            const form = new FormData()
            form.append('file', fileData, 'tmp.' + ext)
            fetch('https://telegra.ph/upload', {
                    method: 'POST',
                    body: form
                })
                .then(res => res.json())
                .then(res => {
                    if (res.error) return reject(res.error)
                    resolve('https://telegra.ph' + res[0].src)
                })
                .then(() => fs.unlinkSync(filePath))
                .catch(err => reject(err))
        })
    })
}

const artinama = async (arti) => {
    const artinam = await fetch(`https://scrap.terhambar.com/nama?n=${arti}`)
    if (!artinam.ok) throw new Error(`unexpected response ${artinam.statusText}`);
    const artinama = await artinam.json()
    if (artinama.status === true) return `*${artinama.result.arti}*`
    return `[ Error ] Arti nama ${arti} tidak di temukan!`
}


const quoteit = async (quotes, author = 'Benny Hidayat', type = 'random') => {
    var q = quotes.replace(/ /g, '%20').replace('\n','%5Cn')
    const response = await fetch(`https://terhambar.com/aw/qts/?kata=${q}&author=Benny%20Hidayat&tipe=random&font=./font/font4.otf&size=55`)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
    const json = await response.json()
    if (json.status) {
        if (json.result !== '') {
            const base64 = await getBase64(json.result)
            return base64
        }
    }
}

const quotemaker = async (quotes, author = 'EmditorBerkelas', type = 'random') => {
    var q = quotes.replace(/ /g, '%20').replace('\n','%5Cn')
    const response = await fetch(`https://terhambar.com/aw/qts/?kata=${q}&author=${author}&tipe=${type}`)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
    const json = await response.json()
    if (json.status) {
        if (json.result !== '') {
            const base64 = await getBase64(json.result)
            return base64
        }
    }
}

const processTime = (timestamp, now) => {
    // timestamp => timestamp when message was received
    return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

const getStickerMaker = (link) => new Promise((resolve, reject) => {
    fetch('https://api.areltiyan.site/sticker_maker?text='+encodeURIComponent(link), {
        method: 'GET',
    })
    .then(async res => {
        const text = await res.json()

        resolve(text)
        
     })
    .catch(err => reject(err))
});

const covidworld = async (covid) => {
    const cvdwrld = await fetch(`https://api.terhambar.com/negara/World`)
    if (!cvdwrld.ok) throw new Error(`unexpected response ${artinam.statusText}`);
    const cvd = await cvdwrld.json()
    if (covidworld.status === true) return `*➸NEGARA: ${cvd.negara} \n➸TOTAL: ${cvd.total} \n➸KASUS BARU: ${cvd.kasus_baru} \n➸MENINGGAL: ${cvd.meninggal} \n➸MENINGGAL BARU: ${cvd.meninggal_baru} \n➸SEMBUH: ${cvd.sembuh} \n➸PENANGANAN: ${cvd.penanganan} \n➸TERAKHIR: ${cvd.terakhir}*`
    return `COVID UDAH BUBAR`
}

const emojiStrip = (string) => {
    return string.replace(emoji, '')
}
const fb = async (url) => {
    const response = await fetch(`http://scrap.terhambar.com/fb?link=${url}`)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
    const json = await response.json()
    if (json.status === true) return {
        'capt': json.result.title, 'exts': '.mp4', 'url': json.result.linkVideo.sdQuality
    }
    return {
        'capt': '[ ERROR ] Not found!', 'exts': '.jpg', 'url': 'https://c4.wallpaperflare.com/wallpaper/976/117/318/anime-girls-404-not-found-glowing-eyes-girls-frontline-wallpaper-preview.jpg'
    }
}

const ss = async(query) => {
    request({
        url: "https://api.apiflash.com/v1/urltoimage",
        encoding: "binary",
        qs: {
            access_key: "2fc9726e595d40eebdf6792f0dd07380",
            url: query
        }
    }, (error, response, body) => {
        if (error) {
            console.log(error);
        } else {
            fs.writeFile("./media/img/screenshot.jpeg", body, "binary", error => {
                console.log(error);
            })
        }
    })
}

const randomNimek = async (type) => {
    var url = 'https://api.computerfreaker.cf/v1/'
    switch(type) {
        case 'nsfw':
            const nsfw = await fetch(url + 'nsfwneko')
            if (!nsfw.ok) throw new Error(`unexpected response ${nsfw.statusText}`)
            const resultNsfw = await nsfw.json()
            return resultNsfw.url
            break
        case 'hentai':
            const hentai = await fetch(url + 'hentai')
            if (!hentai.ok) throw new Error(`unexpected response ${hentai.statusText}`)
            const resultHentai = await hentai.json()
            return resultHentai.url
            break
        case 'anime':
            let anime = await fetch(url + 'anime')
            if (!anime.ok) throw new Error(`unexpected response ${anime.statusText}`)
            const resultNime = await anime.json()
            return resultNime.url
            break
        case 'neko':
            let neko = await fetch(url + 'neko')
            if (!neko.ok) throw new Error(`unexpected response ${neko.statusText}`)
            const resultNeko = await neko.json()
            return resultNeko.url
            break
        case 'trap':
            let trap = await fetch(url + 'trap')
            if (!trap.ok) throw new Error(`unexpected response ${trap.statusText}`)
            const resultTrap = await trap.json()
            return resultTrap.url
            break
    }
}

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const jadwalTv = async (query) => {
    const res = await fetch(`http://docs-jojo.herokuapp.com/api/jadwaltv?ch=${query}`)
    if (res.error) return res.error
	const respon = await res.json()
    switch(query) {
        case 'antv':
            return `\t\t[ ANTV ]\n${respon.result('\n')}`
            break
        case 'gtv':
            return `\t\t[ GTV ]\n${respon.result('\n')}`
            break
        case 'indosiar':
            return `\t\t[ INDOSIAR ]\n${respon.result('\n')}`
            break
        case 'inewstv':
            return `\t\t[ iNewsTV ]\n${respon.result('\n')}`
            break
        case 'kompastv':
            return `\t\t[ KompasTV ]\n${respon.result('\n')}`
            break
        case 'mnctv':
            return `\t\t[ MNCTV ]\n${respon.result('\n')}`
            break
        case 'metrotv':
            return `\t\t[ MetroTV ]\n${respon.result('\n')}`
            break
        case 'nettv':
            return `\t\t[ NetTV ]\n${respon.result('\n')}`
            break
        case 'rcti':
            return `\t\t[ RCTI ]\n${respon.result('\n')}`
            break
        case 'sctv':
            return `\t\t[ SCTV ]\n${respon.result('\n')}`
            break
        case 'rtv':
            return `\t\t[ RTV ]\n${respon.result('\n')}`
            break
        case 'trans7':
            return `\t\t[ Trans7 ]\n${respon.result('\n')}`
            break
        case 'transtv':
            return `\t\t[ TransTV ]\n${respon.result('\n')}`
            break
        default:
            return '[ ERROR ] Channel TV salah! silahkan cek list channel dengan mengetik perintah *#listChannel*'
            break
    }
}

exports.liriklagu = liriklagu;
exports.stickerburn = stickerburn;
exports.bikinmeme = bikinmeme;
exports.stickertrigger = stickertrigger;
exports.uploadImages = uploadImages;
exports.artinama = artinama;
exports.quoteit = quoteit;
exports.quotemaker = quotemaker;
exports.processTime = processTime;
exports.getStickerMaker = getStickerMaker;
exports.covidworld = covidworld;
exports.randomNimek = randomNimek
exports.fb = fb
exports.emojiStrip = emojiStrip
exports.sleep = sleep
exports.jadwalTv = jadwalTv
exports.ss = ss