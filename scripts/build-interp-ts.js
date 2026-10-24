const fs = require('fs');
const path = require('path');

const extracted = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted-interpretations.json'), 'utf8'));

const SIGN_MOTTOS = {
  'Koç': 'Öncülük etmek, cesaret ve girişim ruhu.',
  'Boğa': 'Sabırla inşa etmek, kalıcılık ve güven.',
  'İkizler': 'Öğrenmek, aktarmak, merak ve iletişim.',
  'Yengeç': 'Korumak, beslemek, şefkat ve duygusal bağlar.',
  'Aslan': 'Işıldamak, yönetmek, yaratıcılık ve özgüven.',
  'Başak': 'Düzenleyerek iyileştirmek, ustalık ve analiz.',
  'Terazi': 'Uyum ve denge aramak, estetik ve adalet.',
  'Akrep': 'Dönüştürmek ve derinleşmek, tutku ve sezgi.',
  'Yay': 'Anlam aramak, vizyon ve keşif.',
  'Oğlak': 'Sorumluluk almak, disiplin ve zirveye odaklanmak.',
  'Kova': 'Yenilik getirmek, özgür düşünce ve vizyonerlik.',
  'Balık': 'Bütünleşmek, empati, hayal gücü ve teslimiyet.'
};

const HOUSE_MEANINGS = {
  1: { title: '1. Ev (Yükselen)', desc: 'Kişilik, dış görünüş, ilk izlenim ve hayata yaklaşım tarzı.' },
  2: { title: '2. Ev', desc: 'Maddi kaynaklar, kişisel değerler, kazanma kapasitesi ve güven ihtiyacı.' },
  3: { title: '3. Ev', desc: 'İletişim, yakın çevre, kardeşler, düşünce yapısı ve kısa yolculuklar.' },
  4: { title: '4. Ev (Dip Noktası - IC)', desc: 'Ev, yuva, aile, kökler, içsel huzur ve geçmiş temelleri.' },
  5: { title: '5. Ev', desc: 'Aşk, yaratıcılık, kendini ifade etme, çocuklar ve yaşam neşesi.' },
  6: { title: '6. Ev', desc: 'Günlük rutinler, çalışma ortamı, sağlık ve hizmet etme bilinci.' },
  7: { title: '7. Ev (Alçalan - DSC)', desc: 'İkili ilişkiler, evlilik, ortaklıklar ve karşılıklı taahhütler.' },
  8: { title: '8. Ev', desc: 'Dönüşüm, ortak paylaşılan kaynaklar, krizler ve içsel güç.' },
  9: { title: '9. Ev', desc: 'Yüksek öğrenim, felsefe, dünya görüşü, inançlar ve uzak seyahatler.' },
  10: { title: '10. Ev (Tepe Noktası - MC)', desc: 'Kariyer, toplumsal statü, hedefler ve toplumdaki saygınlık.' },
  11: { title: '11. Ev', desc: 'Sosyal çevre, arkadaş grupları, toplumsal idealler ve gelecek umutları.' },
  12: { title: '12. Ev', desc: 'Bilinçdışı, içe çekilme, maneviyat, gizli yetenekler ve ruhsal şifa.' }
};

const ASPECT_MEANINGS = {
  'Kavuşum': 'İki gezegenin enerjilerinin birleştiği, en güçlü ve doğrudan ifade bulan açı.',
  'Altmışlık': 'Fırsatlar ve yeteneklerin rahatça aktığı, destekleyici ve uyumlu bir etkileşim.',
  'Kare': 'Büyüme ve gelişim getiren, harekete geçirici yapıcı gerilim açısı.',
  'Üçgen': 'Doğal akış, şans, ilham ve zahmetsizce çalışan yetenekler.',
  'Karşıt': 'İki farklı kutup arasında denge kurma ve ilişkilerde farkındalık açısı.'
};

const tsContent = `// Astroloji.org tabanlı doğum haritası yorum arşivi

export const SIGN_MOTTOS: Record<string, string> = ${JSON.stringify(SIGN_MOTTOS, null, 2)};

export const HOUSE_MEANINGS: Record<number, { title: string; desc: string }> = ${JSON.stringify(HOUSE_MEANINGS, null, 2)};

export const ASPECT_MEANINGS: Record<string, string> = ${JSON.stringify(ASPECT_MEANINGS, null, 2)};

export const PLANET_SIGN_INTERPRETATIONS: Record<string, Record<string, string[]>> = ${JSON.stringify(extracted.yorumlar, null, 2)};

export const RETRO_INTERPRETATIONS: Record<string, string[]> = ${JSON.stringify(extracted.retroYorumlari, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/lib/natal-interpretations.ts'), tsContent);
console.log('Successfully generated src/lib/natal-interpretations.ts');
