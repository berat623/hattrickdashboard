const Astronomy = require('astronomy-engine');

const date = new Date(Date.UTC(1995, 4, 15, 11, 30, 0));
const time = new Astronomy.AstroTime(date);
const observer = new Astronomy.Observer(41.0138, 28.9603, 0);

const bodies = [
  { name: 'Güneş', body: Astronomy.Body.Sun },
  { name: 'Ay', body: Astronomy.Body.Moon },
  { name: 'Merkür', body: Astronomy.Body.Mercury },
  { name: 'Venüs', body: Astronomy.Body.Venus },
  { name: 'Mars', body: Astronomy.Body.Mars },
  { name: 'Jüpiter', body: Astronomy.Body.Jupiter },
  { name: 'Satürn', body: Astronomy.Body.Saturn },
  { name: 'Uranüs', body: Astronomy.Body.Uranus },
  { name: 'Neptün', body: Astronomy.Body.Neptune },
  { name: 'Plüton', body: Astronomy.Body.Pluto }
];

const burclar = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];

console.log('=== ASTRONOMY ENGINE ===');
for (const b of bodies) {
  const vec = Astronomy.GeoVector(b.body, time, true);
  const elatlon = Astronomy.Ecliptic(vec);
  const lon = (elatlon.elon % 360 + 360) % 360;
  const signIdx = Math.floor(lon / 30);
  const deg = Math.floor(lon % 30);
  const min = Math.floor((lon % 1) * 60);

  const timeTomorrow = new Astronomy.AstroTime(new Date(date.getTime() + 86400000));
  const v2 = Astronomy.GeoVector(b.body, timeTomorrow, true);
  const lonTomorrow = (Astronomy.Ecliptic(v2).elon % 360 + 360) % 360;
  let speed = lonTomorrow - lon;
  if (speed < -180) speed += 360;
  if (speed > 180) speed -= 360;
  const isRetro = speed < 0;

  console.log(`${b.name.padEnd(8)}: ${burclar[signIdx]} ${deg}°${String(min).padStart(2, '0')}' ${isRetro ? 'R' : ''} (speed: ${speed.toFixed(2)})`);
}

const gst = Astronomy.SiderealTime(time);
const ramc = (gst * 15 + observer.longitude) % 360;
const eps = 23.4392911 * Math.PI / 180;
const ramcRad = ramc * Math.PI / 180;
const latRad = observer.latitude * Math.PI / 180;

const mcRad = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(eps));
const mcDeg = ((mcRad * 180 / Math.PI) % 360 + 360) % 360;
const mcSign = Math.floor(mcDeg / 30);
console.log(`MC: ${burclar[mcSign]} ${(mcDeg % 30).toFixed(1)}°`);

const y = Math.cos(ramcRad);
const x = -Math.sin(ramcRad) * Math.cos(eps) - Math.tan(latRad) * Math.sin(eps);
const ascRad = Math.atan2(y, x);
const ascDeg = ((ascRad * 180 / Math.PI) % 360 + 360) % 360;
const ascSign = Math.floor(ascDeg / 30);
console.log(`ASC: ${burclar[ascSign]} ${(ascDeg % 30).toFixed(1)}°`);
