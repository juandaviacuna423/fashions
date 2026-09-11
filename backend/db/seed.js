const db = require('./database');

console.log('🌱 Iniciando seed completo de FashionStore...');

setTimeout(async () => {
  try {
    await db.runAsync('DELETE FROM products');
    await db.runAsync('DELETE FROM categories');
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name='products'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name='categories'");

    const catSQL = `INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)`;
    const cH = await db.runAsync(catSQL, ['Hombre', 'hombre', 'Ropa elegante y moderna para hombre', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800']);
    const cM = await db.runAsync(catSQL, ['Mujer', 'mujer', 'Moda sofisticada para mujer', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']);
    const cNinos = await db.runAsync(catSQL, ['Niños', 'ninos', 'Ropa cómoda para niños', 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800']);
    const cNinas = await db.runAsync(catSQL, ['Niñas', 'ninas', 'Ropa divertida para niñas', 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf5?w=800']);

    const ids = { h: cH.lastID, m: cM.lastID, n: cNinos.lastID, ng: cNinas.lastID };

    const prodSQL = `INSERT INTO products
      (name, description, price, sale_price, category_id, image_url, sizes, colors, rating, reviews_count, is_featured, is_new)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const products = [
      // ── HOMBRE ──────────────────────────────────────────────────────────
      ['Camisa Oxford Slim Fit', 'Camisa de algodón premium con corte slim fit. Ideal para la oficina o salidas casuales. Tejido 100% algodón egipcio.', 54.99, null, ids.h, 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600', '["S","M","L","XL","XXL"]', '["Blanco","Azul Cielo","Gris Claro","Celeste"]', 4.7, 312, 1, 0],
      ['Chaqueta de Cuero Vintage', 'Chaqueta de cuero sintético de alta calidad. Forro interior suave, cierre metálico y bolsillos laterales.', 139.99, 99.99, ids.h, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', '["S","M","L","XL"]', '["Negro","Marrón Tabaco","Camel"]', 4.8, 189, 1, 0],
      ['Jean Slim Fit Premium', 'Denim de alta resistencia con 2% elastano para máxima comodidad. Corte slim moderno y versátil.', 79.99, null, ids.h, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', '["28","30","32","34","36","38"]', '["Azul Oscuro","Azul Claro","Negro","Gris"]', 4.6, 445, 0, 1],
      ['Polo Casual Premium', 'Polo de algodón piqué con botones de nácar. Cuello ribeteado y ajuste perfecto.', 34.99, null, ids.h, 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600', '["XS","S","M","L","XL","XXL"]', '["Blanco","Negro","Navy","Borgoña","Verde Oliva"]', 4.4, 278, 0, 0],
      ['Traje Ejecutivo Azul', 'Traje de dos piezas en lana mezclada. Corte europeo con solapa estrecha. Incluye pantalón a juego.', 289.99, 229.99, ids.h, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', '["38","40","42","44","46","48"]', '["Azul Marino","Gris Marengo","Negro Carbón"]', 4.9, 98, 1, 0],
      ['Hoodie Streetwear', 'Sudadera con capucha de felpa gruesa. Bolsillo canguro y cordones ajustables. Estilo urbano premium.', 64.99, 49.99, ids.h, 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600', '["XS","S","M","L","XL","XXL","3XL"]', '["Gris Melanizado","Negro","Beige","Verde Caqui","Granate"]', 4.7, 523, 1, 1],
      ['Pantalón Chino Slim', 'Pantalón chino de gabardina stretch. Corte slim con cintura media. Perfecto para look smart-casual.', 59.99, null, ids.h, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600', '["28","30","32","34","36","38"]', '["Beige","Khaki","Azul Marino","Verde Musgo","Negro"]', 4.5, 367, 0, 0],
      ['Blazer Sport Moderno', 'Blazer de tejido técnico liviano. Sin entretela para mayor movilidad. Diseño contemporáneo.', 119.99, null, ids.h, 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f5e?w=600', '["S","M","L","XL","XXL"]', '["Azul Medianoche","Gris Perla","Negro","Camel"]', 4.8, 156, 1, 1],
      ['Camiseta Básica Pack x3', 'Pack de 3 camisetas de algodón peinado 100%. Cuello redondo y corte regular. El básico imprescindible.', 29.99, null, ids.h, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', '["S","M","L","XL","XXL"]', '["Blanco/Negro/Gris"]', 4.6, 892, 1, 0],
      ['Camisa de Lino Verano', 'Camisa de lino natural transpirable. Perfecta para días cálidos. Manga larga enrollable.', 44.99, 34.99, ids.h, 'https://images.unsplash.com/photo-1602810316693-3667c854239a?w=600', '["S","M","L","XL"]', '["Blanco","Azul Marino","Beige","Verde Sage"]', 4.5, 234, 0, 1],
      ['Bermuda Cargo Urbana', 'Bermuda con múltiples bolsillos funcionales. Tejido ripstop resistente al desgaste.', 49.99, 39.99, ids.h, 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600', '["S","M","L","XL","XXL"]', '["Kaki","Negro","Verde Militar","Gris"]', 4.3, 198, 0, 0],
      ['Parka Impermeable Premium', 'Parka larga con relleno de plumón sintético. Impermeable clase 3, con capucha desmontable.', 179.99, 149.99, ids.h, 'https://images.unsplash.com/photo-1542756088-af2b83cd0bfb?w=600', '["S","M","L","XL","XXL"]', '["Negro","Verde Oscuro","Gris Acero"]', 4.8, 142, 0, 1],

      // ── MUJER ───────────────────────────────────────────────────────────
      ['Vestido Midi Floral', 'Vestido midi con estampado floral vibrante. Escote en V y mangas voluminosas. Tela viscosa fluida.', 74.99, 54.99, ids.m, 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600', '["XS","S","M","L","XL"]', '["Flores Rosa","Flores Azul","Flores Rojo"]', 4.7, 412, 1, 0],
      ['Blazer Mujer Oversized', 'Blazer oversized de tendencia con solapa ancha. Un must-have de la temporada.', 124.99, null, ids.m, 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f5e?w=600', '["XS","S","M","L","XL"]', '["Camel","Negro","Crema","Cuadros Príncipe de Gales"]', 4.9, 289, 1, 1],
      ['Jean Mom Fit Tiro Alto', 'Jean de tiro alto con corte mom fit. Tela denim rígida de alta calidad. El jeans favorito de temporada.', 79.99, null, ids.m, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600', '["24","25","26","27","28","29","30","32"]', '["Azul Claro Vintage","Azul Oscuro","Negro","Blanco"]', 4.6, 634, 0, 0],
      ['Blusa Saten Elegante', 'Blusa de satén con cuello lazo. Caída perfecta y brillo sutil. Ideal para el trabajo y eventos.', 49.99, 39.99, ids.m, 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600', '["XS","S","M","L"]', '["Champagne","Negro","Azul Real","Rosa Palo","Menta"]', 4.5, 318, 0, 0],
      ['Abrigo Lana Doble Faz', 'Abrigo largo reversible de lana premium. Dos looks en una sola prenda. El comodín del invierno.', 199.99, 159.99, ids.m, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600', '["XS","S","M","L","XL"]', '["Camel/Rojo","Negro/Gris","Beige/Azul"]', 4.9, 167, 1, 0],
      ['Falda Plisada Midi', 'Falda plisada de seda artificial con movimiento fluido. Tiro alto y elástico en cintura.', 54.99, null, ids.m, 'https://images.unsplash.com/photo-1583496661160-fb5218ees3b?w=600', '["XS","S","M","L","XL"]', '["Rosa Palo","Verde Sage","Lavanda","Negro","Dorado"]', 4.4, 245, 0, 1],
      ['Top Cropped Tejido', 'Top cropped en tejido canalé elástico. Cuello redondo y manga corta. Combina con todo.', 24.99, null, ids.m, 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600', '["XS","S","M","L"]', '["Blanco","Negro","Beige","Azul Klein","Coral"]', 4.6, 521, 1, 1],
      ['Vestido Cóctel Lentejuelas', 'Vestido mini de lentejuelas para eventos especiales. Tirantes finos y escote recto. Glamour total.', 89.99, 74.99, ids.m, 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=600', '["XS","S","M","L"]', '["Dorado","Plateado","Negro","Champagne"]', 4.8, 198, 1, 1],
      ['Conjunto Deportivo Lujo', 'Set de leggings y top deportivo de lycra de alta compresión. Diseño ergonómico para máximo rendimiento.', 79.99, 64.99, ids.m, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600', '["XS","S","M","L","XL"]', '["Negro","Rosa Neon","Azul Eléctrico","Coral","Lila"]', 4.7, 356, 0, 1],
      ['Camisa de Seda Premium', 'Camisa de seda pura con botones nacarados. Tejido suave y frío al tacto. Lujo cotidiano.', 109.99, null, ids.m, 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f5e?w=600', '["XS","S","M","L"]', '["Marfil","Negro","Azul Hielo","Burdeos"]', 4.8, 134, 1, 0],
      ['Cardigan Oversize Mohair', 'Cardigan voluminoso de mezcla mohair. Suave, cálido y ultra trendy. El tejido del momento.', 84.99, 69.99, ids.m, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600', '["S/M","L/XL"]', '["Camel","Crema","Gris","Rosa","Azul Hielo"]', 4.6, 287, 0, 1],
      ['Body Encaje Romántico', 'Body de encaje con escote V y cierre de broche. Elegancia y sensualidad en una sola pieza.', 39.99, 29.99, ids.m, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600', '["XS","S","M","L","XL"]', '["Negro","Nude","Blanco","Borgoña"]', 4.5, 423, 0, 0],

      // ── NIÑOS ───────────────────────────────────────────────────────────
      ['Conjunto Jogger Dino', 'Sudadera y pantalón con bordados de dinosaurios. Felpa suave interior. Perfecto para el día a día.', 39.99, 29.99, ids.n, 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600', '["2T","3T","4T","5T","6T","7T"]', '["Azul/Verde","Gris/Verde","Naranja/Azul"]', 4.8, 567, 1, 0],
      ['Camisa Cuadros Flannel', 'Camisa de franela a cuadros. Suave, cálida y resistente. Ideal para el colegio o paseos.', 24.99, null, ids.n, 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600', '["4","6","8","10","12","14"]', '["Rojo/Negro","Azul/Verde","Verde/Gris"]', 4.5, 234, 0, 1],
      ['Jean Clásico Reforzado', 'Jean 100% algodón con parches reforzados en rodillas. Elástico interior para mayor comodidad.', 34.99, 24.99, ids.n, 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600', '["4","6","8","10","12","14","16"]', '["Azul Desgastado","Azul Oscuro","Negro"]', 4.6, 389, 0, 0],
      ['Chaqueta Impermeable Color', 'Chaqueta con capucha y forro polar interior. Impermeable y transpirable. ¡Para todas las aventuras!', 54.99, null, ids.n, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600', '["4","6","8","10","12"]', '["Rojo","Azul","Amarillo","Verde Bosque"]', 4.7, 312, 1, 0],
      ['Pijama Espacio Astronauta', 'Pijama de dos piezas con estampado espacial. Tela 100% algodón orgánico. Suave para la piel sensible.', 29.99, null, ids.n, 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600', '["2T","3T","4T","5T","6T"]', '["Azul Espacial","Negro Galaxia"]', 4.9, 445, 1, 1],
      ['Polo Escolar Pack x2', 'Pack de 2 polos escolares de algodón peinado. Resistentes al lavado frecuente. Colores que no desteñen.', 19.99, null, ids.n, 'https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?w=600', '["4","6","8","10","12","14"]', '["Blanco x2","Azul x2","Blanco+Azul"]', 4.5, 678, 0, 0],
      ['Sudadera Canguro Print', 'Sudadera con capucha y bolsillo canguro. Estampados exclusivos de animales. Muy abrigadora.', 34.99, 27.99, ids.n, 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600', '["4","6","8","10","12"]', '["León","Oso Panda","Tiburón"]', 4.6, 298, 0, 1],
      ['Short Deportivo Rápido Secado', 'Short deportivo de tejido técnico. Elástico en cintura y bolsillo lateral. Para deporte y juego.', 19.99, 14.99, ids.n, 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600', '["4","6","8","10","12","14"]', '["Azul","Negro","Verde","Rojo","Gris"]', 4.4, 234, 0, 0],

      // ── NIÑAS ───────────────────────────────────────────────────────────
      ['Vestido Tul Princesa', 'Vestido de gala con falda de tul multicapa. Lazo en la espalda y detalles perlados. Para ocasiones especiales.', 54.99, 44.99, ids.ng, 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf5?w=600', '["2T","3T","4T","5T","6T","7T","8T"]', '["Rosa Fucsia","Lila","Azul Cielo","Blanco Nube"]', 4.9, 534, 1, 0],
      ['Conjunto Casual Corazones', 'Sudadera y leggings con estampado de corazones. Tejido suave y elástico. Comodidad todo el día.', 35.99, null, ids.ng, 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600', '["2T","3T","4T","5T","6T","7T"]', '["Rosa/Blanco","Rojo/Rosa","Lila/Blanco"]', 4.7, 378, 1, 1],
      ['Pijama Unicornio Mágico', 'Pijama de dos piezas con unicornios brillantes. Algodón 100% suave. Con detalles de purpurina.', 32.99, 26.99, ids.ng, 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600', '["2T","3T","4T","5T","6T","7T"]', '["Rosa Magic","Lila Dream","Menta Star"]', 4.9, 623, 1, 1],
      ['Vestido Casual Rayas', 'Vestido de rayas con volantes en el bajo. Tirantes anchos y bolsillos laterales. Fresco y cómodo.', 29.99, null, ids.ng, 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600', '["4","6","8","10","12","14"]', '["Rosa/Blanco","Azul/Blanco","Rojo/Blanco"]', 4.6, 289, 0, 0],
      ['Chaqueta Pelo Sintético', 'Chaqueta de pelo sintético suave tipo teddy bear. Cálida y adorable. Tendencia máxima esta temporada.', 49.99, 39.99, ids.ng, 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600', '["4","6","8","10","12"]', '["Rosa Palo","Crema","Lila","Gris Perla"]', 4.8, 412, 1, 1],
      ['Pack Leggings x3 Colores', 'Pack de 3 leggings de algodón elástico. Cintura alta y confortables todo el día.', 24.99, null, ids.ng, 'https://images.unsplash.com/photo-1583496661160-fb5218ees3b?w=600', '["2T","3T","4T","5T","6T","7T","8T"]', '["Rosa+Lila+Negro","Azul+Verde+Gris","Blanco+Rosa+Coral"]', 4.5, 567, 0, 0],
      ['Blusa Lazos Romántica', 'Blusa con lazos en mangas y cuello. Tela de gasa suave. Estilo romántico y femenino.', 27.99, 22.99, ids.ng, 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600', '["4","6","8","10","12","14"]', '["Blanco","Rosa Claro","Lila","Melocotón"]', 4.6, 334, 0, 1],
      ['Falda Tutú Bailarina', 'Mini falda tutú multicapa de tul. Cintura elástica confortable. Para bailar, jugar y brillar.', 22.99, null, ids.ng, 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf5?w=600', '["2T","3T","4T","5T","6T"]', '["Rosa","Lila","Blanco","Azul","Rojo"]', 4.8, 445, 1, 0],
    ];

    for (const p of products) {
      await db.runAsync(prodSQL, p);
    }

    console.log(`✅ ${products.length} productos creados.`);
    console.log('🎉 Seed completado! FashionStore listo.');
    db.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}, 500);
