/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint linebreak-style: ["error", "unix"] */
import axios, { Axios } from "axios";
import { TrueManga, personal, MangaData } from "./classes/Manga";
import { MangaModel } from "./models/MangaModel";
import { querysToapi } from "./classes/querysToApi";
import { Chapters } from "./classes/Chapters";
import { ChapterModel } from "./models/ChapterModel";
var fs = require('fs'),
    request = require('request');

const GetMangaFromApi = async () => {
  let Info: any[] = [];
  const Mangas: TrueManga[] = [];
  let Artista = "";
  let Autor = "";
  let Imagen = "";
  for (let x = 5; x < 6; ) {
    for (let i = 5; i <= 7; ) {
      // eslint-disable-next-line no-await-in-loop
      // eslint-disable-next-line no-loop-func
      await axios
        .get<TrueManga[]>(
          `https://api.mangadex.org/manga?includes[]=cover_art&includes[]=author&includes[]=artist&limit=100&offset=${x}${i}00`
        )
        .then((res: any) => {
          Info.push(res.data.data);
          console.log(`MEM=> Manga ${x}${i}00 cargado`);
        });
      i += 1;
    }
    x += 1;
  }
  Info = Info.flat(1);
  Info.forEach((Manga) => {
    let Personal: any;
    const Datos: MangaData = {
      ultimoVolumen: Manga.attributes.lastVolume,
      ultimoCapitulo: Manga.attributes.lastChapter,
      contentRating: Manga.attributes.contentRating,
      fechaCreacion: Manga.attributes.createdAt,
      fechaActualizacion: Manga.attributes.updatedAt,
      titulo: Manga.attributes.title.en,
      genero: Manga.attributes.publicationDemographic,
      estado: Manga.attributes.status,
      descripcion: Manga.attributes.description.en,
    };
    Manga.relationships.forEach((relaciones: any) => {
      if (relaciones.attributes !== undefined) {
        if (relaciones.type === "artist") {
          Artista = relaciones.attributes.name;
        }
        if (relaciones.type === "author") {
          Autor = relaciones.attributes.name;
        }
        if (relaciones.type === "cover_art") {
          Imagen = relaciones.attributes.fileName;
        }
      }
      const objects: personal = {
        artista: Artista,
        autor: Autor,
        imagen: Imagen,
      };
      Personal = objects;
    });
    const [tags] = Manga.attributes.tags;
    const tipo = Manga.type;
    const ApiID = Manga.id;
    const manga = new TrueManga(Datos, Personal, tags, tipo, ApiID);
    manga.instCover();
    Mangas.push(manga);
  });
  let a = 0;

  await Promise.all(
    Mangas.map(async (Manga) => {
      const saver = new MangaModel(Manga);
      await saver.save().then(() => console.log(`manga ${a} guardado`));
      a += 1;
    })
  );
  console.log("terminado");
  return Mangas;
};

const getChaptersFromApi = async () => {
  let a = 0;
  const apiID: any[] = await MangaModel.find({}).select({ apiID: 1 });
  let volumes: any[] = [];
  const postVolumes:any = []
  let chapters: any[] = [];
  let trueChapters: any[] = [];
  let b: Chapters[] = []
  for await (const id of apiID) {
    await axios
      .get(`https://api.mangadex.org/manga/${id.apiID}/aggregate`)
      .then((res) => {
        res.data._id = id._id;
        volumes.push(res.data);
        console.log("\x1b[34m",`MEM => Capitulos de manga ${id._id} cargados`);
      })
      .catch((err) => {
        console.log("manga fallido");
      });
  }
  
  console.log('ordenando el array....')

  volumes.forEach((volume) => {
    let key = Object.keys(volume.volumes);
    for (let i = 0; i < key.length; i++) {
      let a = key[i];
      chapters.push(volume.volumes[a]);
    }
    let data = chapters;
    chapters = [];
    trueChapters.push(new Chapters(volume._id,data));
  });

  console.log(trueChapters)

  trueChapters.forEach((volume) => {
    let key = Object.keys(volume.chapter);
    for (let i = 0; i < key.length; i++) {
      let a = key[i];
      chapters.push(volume.chapter[a].chapters);
    }
    let data = chapters;
    chapters = [];
    b.push(new Chapters(volume._id,data));
  });

  volumes = [];

  b.forEach((volume:any) => {
    let key = Object.keys(volume.chapter);
    for (let i = 0; i < key.length; i++) {
      let a = key[i];
      chapters.push(Object.values(volume.chapter[a]));
    }
    let data = chapters;
    chapters = [];
    volumes.push(new Chapters(volume._id,data));
  });

  await Promise.all(
    volumes.map(async (Chapter) => {
      const saver = new ChapterModel(Chapter);
    await saver
      .save()
      .then(() =>
        console.log( "\x1b[32m",`BD => Capitulos del manga ${Chapter._id} guardado`) 
      )
      .catch((err:any) => console.log(err));
    a += 1;
    })
  );

  let images=axios
};

const download = function(uri:string|undefined, filename:string, callback:Function){
  request.head(uri, function(err:any, res:any, body:any){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

const main = async () => {
  const checker = [10,300,200,130];
  const checkValues: Array<any> = [];
  let x = 0;
  await Promise.all(
    checker.map(async (x) => {
      checkValues.push(await MangaModel.findOne({ _id: { $eq: x } }));
    })
  );

  checkValues.forEach((error) => {
    if (error === null) {
      x += 1;
    }
  });
  if (x > 3) {
    await GetMangaFromApi();
  }

  await getChaptersFromApi();
  console.log('terminado')
  };
  // await querysToapi.URL();
;
main();
