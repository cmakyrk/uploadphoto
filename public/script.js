document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const uploadButton = document.getElementById('upload-button');
    const statusMessage = document.getElementById('status-message');

    // Dosya seçildiğinde, seçilen dosyaların isimlerini listeleyelim.
    fileInput.addEventListener('change', () => {
        fileList.innerHTML = ''; // Önceki listeyi temizle
        const files = fileInput.files;
        if (files.length > 0) {
            for (const file of files) {
                const fileItem = document.createElement('div');
                fileItem.textContent = file.name;
                fileList.appendChild(fileItem);
            }
        }
    });

    // Form gönderildiğinde dosya yükleme işlemini başlatalım.
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Formun varsayılan davranışını engelle

        const files = fileInput.files;
        if (files.length === 0) {
            showStatus('Lütfen en az bir dosya seçin.', 'error');
            return;
        }

        const formData = new FormData();
        for (const file of files) {
            formData.append('files', file);
        }

        // Yükleme sırasında butonu devre dışı bırak ve yükleniyor animasyonu göster
        setUploading(true);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                showStatus(result.message, 'success');
                uploadForm.reset(); // Formu sıfırla
                fileList.innerHTML = ''; // Dosya listesini temizle
            } else {
                showStatus(result.message || 'Bir hata oluştu.', 'error');
            }
        } catch (error) {
            console.error('Yükleme hatası:', error);
            showStatus('Sunucuya bağlanırken bir sorun oluştu.', 'error');
        } finally {
            // Yükleme tamamlandığında butonu tekrar aktif et
            setUploading(false);
        }
    });

    // Durum mesajını göstermek için yardımcı fonksiyon
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
    }

    // Yükleme durumunu ayarlamak için yardımcı fonksiyon
    function setUploading(isUploading) {
        if (isUploading) {
            uploadButton.disabled = true;
            uploadButton.innerHTML = 'Yükleniyor... <span class="loader"></span>';
        } else {
            uploadButton.disabled = false;
            uploadButton.innerHTML = 'Anıları Yükle';
        }
    }
}); 