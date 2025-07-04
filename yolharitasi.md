# Yol Haritası: Düğün Anıları Toplama Sitesi

**Amaç:** Düğünümüze katılan misafirlerin, o gün çektikleri fotoğraf ve videoları kolayca yükleyebileceği, şık ve basit bir web sitesi oluşturmak. Böylece tüm anılar tek bir yerde toplanmış olacak.

---

## Depolama Stratejisi

Projemiz için iki temel depolama yaklaşımı belirledik. **Hızlı bir başlangıç için Alternatif 1 ile başlayacağız**, ancak gelecekte daha güvenli bir çözüme geçmek için Alternatif 2'yi de hazırda tutacağız.

### Alternatif 1 (Ana Plan): Dosyaları Doğrudan Sunucuya Yükleme

Bu planda, misafirlerin yüklediği dosyalar doğrudan web sitemizi barındıran sunucudaki bir klasöre (`uploads/`) kaydedilir.

*   **Avantajları:**
    *   **En Hızlı Kurulum:** Harici bir API (Google vb.) ile uğraşmaya gerek olmadığı için en çabuk hayata geçirilecek yöntemdir.
    *   **Basit Kod Yapısı:** Sunucu taraflı kod daha az karmaşıktır.
*   **Dezavantajları:**
    *   **Depolama Limiti:** Sunucuların disk alanı sınırlıdır ve yüksek çözünürlüklü dosyalarla çabucak dolabilir.
    *   **VERİ KAYBI RİSKİ:** Sunucular kalıcı arşivleme için tasarlanmamıştır. Sunucuya bir şey olursa veya proje bittiğinde sunucu kapatılırsa, **tüm anılar kaybolabilir.**
    *   **Zor Erişim:** Dosyaları almak için sunucuya FTP/SFTP gibi teknik programlarla bağlanmak gerekir.

---

### Alternatif 2 (Önerilen Uzun Vadeli Plan): Google Drive'a Yükleme

Bu planda, sunucu bir aracı görevi görür ve dosyaları güvenli bir şekilde sizin özel Google Drive klasörünüze yönlendirir.

*   **Avantajları:**
    *   **ANILAR GÜVENDE:** Dosyalar Google'ın güvenli altyapısında, sizin hesabınızda saklanır. Site kapansa bile anılarınız kalıcıdır.
    *   **Geniş ve Kolay Depolama:** Google'ın sunduğu geniş depolama alanını kullanır ve dosya yönetimi çok kolaydır.
    *   **Kolay Erişim:** Tüm anılara istediğiniz zaman, istediğiniz yerden normal bir Drive klasörü gibi erişebilirsiniz.
*   **Dezavantajları:**
    *   **Başlangıç Kurulumu:** Başlangıçta Google API ayarlarının yapılması gerekir.

---

## Geliştirme Adımları (Ana Plan'a Göre)

### Aşama 1: Proje Kurulumu ve Yapılandırma

1.  **Node.js Projesini Başlatma:**
    *   `package.json` dosyası oluşturulacak (`npm init -y`).
    *   Gerekli paketler yüklenecek: `express` (sunucu için) ve `multer` (dosya yükleme işlemleri için).
2.  **Klasör Yapısı Oluşturma:**
    *   `public/`: Misafirlerin göreceği `index.html`, `style.css` ve `script.js` dosyaları burada olacak.
    *   `uploads/`: Yüklenen fotoğraf ve videoların sunucuda saklanacağı klasör.

### Aşama 2: Sunucu (Backend) Geliştirme

1.  **Sunucu Dosyası (`server.js`) Oluşturma:**
    *   Express ile basit bir web sunucusu ayağa kaldırılacak.
    *   `public` klasöründeki dosyaların misafirlere sunulması sağlanacak.
2.  **Dosya Yükleme Ayarları:**
    *   `multer` paketi yapılandırılarak, gelen dosyaların `uploads/` klasörüne kaydedilmesi sağlanacak. Dosya boyutu limiti gibi ayarlar da burada yapılabilir.
3.  **API Endpoint'i Oluşturma (`/upload`):**
    *   Site arayüzünden gelen dosya yükleme isteklerini kabul edecek ve `multer` aracılığıyla dosyayı kaydedecek bir adres oluşturulacak.
    *   İşlem sonunda siteye başarı mesajı gönderilecek.

### Aşama 3: Site Arayüzü (Frontend) Geliştirme

*Bu aşama, depolama yönteminden bağımsız olarak büyük ölçüde aynıdır.*

1.  **HTML (`public/index.html`):**
    *   Karşılama mesajı, dosya seçme ve yükleme butonları, durum bilgilendirme alanı.
2.  **CSS (`public/style.css`):**
    *   Düğün konseptine uygun, sade ve şık tasarım.
3.  **JavaScript (`public/script.js`):**
    *   Yükle butonuna basıldığında seçilen dosyaları sunucudaki `/upload` adresine gönderecek kod.

### Aşama 4: Test

1.  Sunucu çalıştırılır (`node server.js`).
2.  Tarayıcıdan siteye girilerek testler yapılır:
    *   Fotoğraf ve video yüklemesi denenir.
    *   Yükleme sonrası sunucudaki **`uploads/` klasörü** kontrol edilir. 