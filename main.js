// Mobile toggle
document.getElementById('menu-toggle').addEventListener('click', () => {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Language sync (main + mobile)
function syncLanguageSelects(value) {
    document.getElementById('language-select').value = value;
    document.getElementById('language-select-mobile').value = value;
}

document.getElementById('language-select').addEventListener('change', function () {
    updateLanguage(this.value);
    syncLanguageSelects(this.value);
});

document.getElementById('language-select-mobile').addEventListener('change', function () {
    updateLanguage(this.value);
    syncLanguageSelects(this.value);
});


const carImages = document.querySelectorAll(".car-image");
let current = 0;
setInterval(() => {
    carImages[current].classList.remove("opacity-100");
    carImages[current].classList.add("opacity-0");
    current = (current + 1) % carImages.length;
    carImages[current].classList.remove("opacity-0");
    carImages[current].classList.add("opacity-100");
}, 4000);


// Form submit
document.addEventListener("DOMContentLoaded", () => {
    const products = [
        { name: "AC Pipe Model A", partNo: "1155" },
        { name: "AC Pipe Model B", partNo: "1156" },
        { name: "AC Pipe Model C", partNo: "1157" },
    ];

    const productNameSelect = document.getElementById('product-name');
    const partNoSelect = document.getElementById('part-no');
    const modal1 = document.getElementById("inquiryModal1");
    const inquiryForm1 = document.getElementById("inquiryForm1");

    // 🔁 Dropdownlarni to‘ldirish
    function populateProducts() {
        productNameSelect.innerHTML = "";
        partNoSelect.innerHTML = "";

        products.forEach(product => {
            const nameOption = document.createElement('option');
            nameOption.value = product.name;
            nameOption.textContent = product.name;
            productNameSelect.appendChild(nameOption);

            const partOption = document.createElement('option');
            partOption.value = product.partNo;
            partOption.textContent = product.partNo;
            partNoSelect.appendChild(partOption);
        });
    }

    // 🔄 Product ↔ PartNo sinxronlash
    productNameSelect.addEventListener('change', () => {
        const selected = products.find(p => p.name === productNameSelect.value);
        if (selected) partNoSelect.value = selected.partNo;
    });

    partNoSelect.addEventListener('change', () => {
        const selected = products.find(p => p.partNo === partNoSelect.value);
        if (selected) productNameSelect.value = selected.name;
    });

    // ✨ Modalni ochish (data bilan)
    document.querySelectorAll('.openInquiryModal1Btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal1.classList.remove('hidden');

            const productName = document.getElementById("product-name-value").textContent.trim();
            const quantity = document.getElementById("quantity-value").textContent.trim().replace(" ea", "");
            const deliveryDate = document.getElementById("delivery-date-value").textContent.trim().split("\n").pop().trim();
            const partNo = document.getElementById("part-no-value").textContent.trim();

            productNameSelect.value = productName || products[0].name;
            partNoSelect.value = partNo || products[0].partNo;
            document.getElementById('quantity').value = quantity || "";
            document.getElementById('delivery-date').value = formatDateForInput(deliveryDate) || "";
        });
    });

    // Sana formatlash helperi
    function formatDateForInput(dateStr) {
        const parts = dateStr.split(".");
        if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
        return "";
    }

    // Modalni boshqarish
    document.getElementById("openInquiryModal1").addEventListener("click", () => {
        modal1.classList.remove("hidden");
    });
    document.getElementById("closeInquiryModal1").addEventListener("click", () => {
        modal1.classList.add("hidden");
    });
    document.getElementById("cancelInquiryModal1").addEventListener("click", () => {
        modal1.classList.add("hidden");
    });
    window.addEventListener("click", (e) => {
        if (e.target === modal1) modal1.classList.add("hidden");
    });

    // Form yuborish
    inquiryForm1.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(inquiryForm1);

        // 💡 Yangi summary matnini yaratish
        const selectedProduct = productNameSelect.value;
        const selectedPartNo = partNoSelect.value;
        const quantity = document.getElementById("quantity").value;
        const deliveryDate = document.getElementById("delivery-date").value;
        const email = new FormData(inquiryForm1).get("email");

        const summaryText = `Quyidagi shaxs ${email} bizdan ${selectedProduct} Part No: ${selectedPartNo} mahsulotidan ${quantity} pcs miqdorida ${deliveryDate} da yetkazib berishimizni so‘radi!`;

        // 🔐 Summary inputga qiymat berish
        const summaryInput = document.getElementById("inquiry-summary");
        if (summaryInput) {
            summaryInput.value = summaryText;
        } else {
            console.warn("Summary input not found!");
        }

        try {
            const response = await fetch(inquiryForm1.action, {
                method: "POST",
                body: new FormData(inquiryForm1),
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {
                showToast("Xabaringiz muvaffaqiyatli yuborildi!", "green");
                inquiryForm1.reset();
                modal1.classList.add("hidden");
            } else {
                const data = await response.json();
                if (data.errors) {
                    showToast(data.errors.map(error => error.message).join(", "), "red");
                } else {
                    showToast("Xatolik yuz berdi.", "red");
                }
            }
        } catch (error) {
            showToast("Xatolik yuz berdi: " + error.message, "red");
        }
    });



    // 🔄 Boshlanishida dropdown to‘ldirish
    populateProducts();
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

const form = document.getElementById('partnerForm');
const modal = document.getElementById('partnerModal');
const toast = document.getElementById('toast');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    // Modalni asta-sekin yopish
    modal.classList.add('modal-fade-out');

    // 300ms kutamiz (transition davomiyligi), keyin yashiramiz
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('modal-fade-out');
    }, 300);

    // Formspree so‘rovi
    const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    });

    form.reset(); // Formani tozalash

    if (response.ok) {
        showToast("Message sent successfully!", "green");
    } else {
        showToast("Failed to send message. Try again!", "red");
    }
});

function showToast(message, color) {
    toast.textContent = message;
    toast.classList.add("top-5")
    toast.classList.add("right-5")
    toast.classList.remove("opacity-0");
    toast.classList.add("opacity-100");
    toast.classList.remove("bg-green-500", "bg-red-500");
    toast.classList.add(`bg-${color}-500`);

    setTimeout(() => {
        toast.classList.remove("opacity-100");
        toast.classList.add("opacity-0");
    }, 3000);
}

// Language translations
const translations = {
    en: {
        about: "About",
        products: "Product",
        advantages: "Advantages",
        partner: "Become Partner",
        contact: "Contact Us",
        hero_title: "Premium Car AC Parts",
        hero_description: "Experience high-performance cooling with our world-class automotive AC components.",
        hero_get_in_touch: "Get In Touch",
        hero_products: "Products",
        inquiry_tab: "Product Inquiry",
        status_tab: "Order Status",
        support_tab: "Support",
        product_name_label: "Product Name",
        product_name_value: "AC Pipe Model A",
        quantity_label: "Quantity",
        quantity_value: "1000 ea",
        delivery_date_label: "Delivery Date",
        delivery_date_value: "01.08.2025",
        part_no_label: "Part No",
        part_no_value: "1155",
        submit_inquiry: "Submit Inquiry !",
        status_text: "Order status section coming soon...",
        support_text: "Support section coming soon...",
        products_title: "Products",
        explore_products: "Explore Our Products",
        products_description: "We offer high-quality pipes for automotive air conditioners to enhance your vehicle performance.",
        request_quote_1: "Request Quote",
        request_quote_2: "Request Quote",
        request_quote_3: "Request Quote",
        request_quote_4: "Request Quote",
        request_quote_5: "Request Quote",
        request_quote_6: "Request Quote",
        request_quote_7: "Request Quote",
        see_all: "See All",
        solutions_title: "Solutions",
        iota_solutions: "<span class='text-red-500 font-bold'>IOTA</span> Solutions",
        solutions_description: "IOTA provides high-quality automotive air conditioner pipes and expert support to enhance vehicle cooling systems.",
        product_manufacturing_title: "Product Manufacturing",
        product_manufacturing_description: "We produce durable AC pipes like Model A and Model B with quick delivery.",
        expert_guidance_title: "Expert Guidance",
        expert_guidance_description: "Our team provides professional guidance and solutions for your AC pipe systems.",
        tailored_solutions_title: "Tailored Solutions",
        tailored_solutions_description: "We design tailored pipe products to meet your unique automotive requirements.",
        advantages_title: "ADVANTAGES",
        why_choose_iota: "Why Choose IOTA?",
        advantages_description: "We offer top-quality automotive air conditioner pipes with reliable benefits. Discover why IOTA stands out.",
        simple_ordering: "Simple Ordering",
        simple_ordering_description: "Order AC pipes with a simple and fast process to keep your production on track.",
        high_durability: "High Durability",
        high_durability_description: "Our pipes are made with high-quality materials for long-lasting performance.",
        professional_agent: "Professional Agent",
        professional_agent_description: "Our team provides expert support to assist with your pipe needs.",
        quality_assurance: "Quality Assurance",
        quality_assurance_description: "We ensure pipe durability with strict quality checks for safe use.",
        customer_satisfaction: "Customer Satisfaction",
        customer_satisfaction_description: "Satisfied with our products or get support if they don’t meet expectations.",
        order_tracking: "Order Tracking",
        order_tracking_description: "Track your order status with our real-time updates for peace of mind.",
        partner_title: "PARTNER WITH US",
        become_partner: "Become a Partner",
        partner_description: "Join IOTA and grow your business with high-quality automotive AC solutions. We are looking for long-term partners worldwide.",
        apply_partner: "Apply to Become a Partner",
        get_in_touch_title: "GET IN TOUCH",
        contact_us_title: "Contact Us",
        contact_description: "If you need consultation with us, you can write a message or call us, we will respond as quickly as possible",
        email_contact: "jooon.hwang@iotauz.com",
        phone_contact: "+998 94 245 0606",
        hours_contact: "Mon - Fri: 8 AM - 5 PM",
        address_contact: "1 Vohid Khaidarov str., Chirchiq, Tashkent region, Uzbekistan",
        our_location: "Our Location",
        footer_description: "We specialize in manufacturing high-quality automotive air conditioning parts, ensuring durability and performance.",
        quick_links_title: "Quick Links",
        footer_about_link: "About",
        footer_products_link: "Product",
        footer_partner_link: "Become Partner",
        footer_contact_link: "Contact Us",
        copyright: "© 2025 IOTA. All rights reserved.",
        partner_modal_title: "Become a Partner",
        full_name_label: "Full Name",
        email_label: "Email",
        company_name_label: "Company Name",
        message_label: "Message",
        submit_partner: "Submit"
    },
    uz: {
        about: "Haqida",
        products: "Mahsulotlar",
        advantages: "Afzalliklar",
        partner: "Hamkorlikka Kirish",
        contact: "Biz bilan Bog'lanish",
        hero_title: "Yuqori Sifatli Avtomobil AC Qismlari",
        hero_description: "Bizning dunyodagi eng yaxshi avtomobil AC komponentlari bilan yuqori samarali sovutishni his eting.",
        hero_get_in_touch: "Biz bilan Bog'laning",
        hero_products: "Mahsulotlar",
        inquiry_tab: "Mahsulot So'rovi",
        status_tab: "Buyurtma Holati",
        support_tab: "Qo'llab-quvvatlash",
        product_name_label: "Mahsulot Nomi",
        product_name_value: "AC Trubka Modeli A",
        quantity_label: "Miqdor",
        quantity_value: "1000 dona",
        delivery_date_label: "Yetkazib Berish Sanasi",
        delivery_date_value: "01.08.2025",
        part_no_label: "Qism Raqami",
        part_no_value: "1155",
        submit_inquiry: "So'rovni Yuborish!",
        status_text: "Buyurtma holati bo'limi tez orada...",
        support_text: "Qo'llab-quvvatlash bo'limi tez orada...",
        products_title: "Mahsulotlar",
        explore_products: "Bizning Mahsulotlarimizni Ko'ring",
        products_description: "Biz avtomobil konditsionerlari uchun yuqori sifatli trubkalar taklif etamiz, bu sizning transport vositangizning samaradorligini oshiradi.",
        request_quote_1: "Narx So'rash",
        request_quote_2: "Narx So'rash",
        request_quote_3: "Narx So'rash",
        request_quote_4: "Narx So'rash",
        request_quote_5: "Narx So'rash",
        request_quote_6: "Narx So'rash",
        request_quote_7: "Narx So'rash",
        see_all: "Hammasini Ko'rish",
        solutions_title: "Yechimlar",
        iota_solutions: "<span class='text-red-500 font-bold'>IOTA</span> Yechimlari",
        solutions_description: "IOTA avtomobil konditsionerlari uchun yuqori sifatli trubkalar va ekspert yordamini ta'minlaydi, transport vositalarini sovutish tizimlarini yaxshilaydi.",
        product_manufacturing_title: "Mahsulot Ishlab Chiqarish",
        product_manufacturing_description: "Biz Model A va Model B kabi bardoshli AC trubkalarini tez yetkazib berish bilan ishlab chiqaramiz.",
        expert_guidance_title: "Ekspert Maslahati",
        expert_guidance_description: "Bizning jamoamiz AC trubka tizimlaringiz uchun professional maslahat va yechimlarni ta'minlaydi.",
        tailored_solutions_title: "Moslashtirilgan Yechimlar",
        tailored_solutions_description: "Biz sizning o'ziga xos avtomobil ehtiyojlaringizga mos trubka mahsulotlarini loyihalashtiramiz.",
        advantages_title: "AFZALLIKLAR",
        why_choose_iota: "Nima Uchun IOTA ni Tanlash?",
        advantages_description: "Biz yuqori sifatli avtomobil konditsioner trubkalarini ishonchli afzalliklar bilan taklif etamiz. IOTA nima uchun ajralib turishini kashf eting.",
        simple_ordering: "Oddiy Buyurtma Berish",
        simple_ordering_description: "AC trubkalarini oddiy va tez jarayon bilan buyurtma qiling, ishlab chiqarishni yo'lga qo'ying.",
        high_durability: "Yuqori Bardoshlilik",
        high_durability_description: "Bizning trubkalarimiz uzoq muddatli ishlash uchun yuqori sifatli materiallardan tayyorlangan.",
        professional_agent: "Professional Agent",
        professional_agent_description: "Bizning jamoamiz trubka ehtiyojlaringizda yordam berish uchun ekspert yordamini ta'minlaydi.",
        quality_assurance: "Sifat Kafolati",
        quality_assurance_description: "Biz trubka bardoshligini xavfsiz foydalanish uchun qat'iy sifat tekshiruvlari bilan ta'minlaymiz.",
        customer_satisfaction: "Mijoz Qoniqishi",
        customer_satisfaction_description: "Mahsulotlarimizdan qoniqsangiz yoki kutilgan natijaga erishmasangiz, yordam oling.",
        order_tracking: "Buyurtma Kuzatuvi",
        order_tracking_description: "Buyurtma holatini real vaqt yangilanishlari bilan kuzating, xotirjam bo'ling.",
        partner_title: "BIZ BILAN HAMKORLIK QILING",
        become_partner: "Hamkor Bo'ling",
        partner_description: "IOTA bilan qo'shiling va yuqori sifatli avtomobil AC yechimlari bilan biznesingizni rivojlantiring. Biz butun dunyo bo'ylab uzoq muddatli hamkorlarni qidirmoqdamiz.",
        apply_partner: "Hamkor Bo'lish Uchun Ariza Berish",
        get_in_touch_title: "BIZ BILAN BOG'LANING",
        contact_us_title: "Biz bilan Bog'laning",
        contact_description: "Agar biz bilan maslahat kerak bo'lsa, xabar yozishingiz yoki qo'ng'iroq qilishingiz mumkin, biz imkon qadar tez javob beramiz",
        email_contact: "jooon.hwang@iotauz.com",
        phone_contact: "+998 94 245 0606",
        hours_contact: "Dush - Juma: 8:00 - 17:00",
        address_contact: "1 Vohid Xaydarov ko'chasi, Chirchiq, Toshkent viloyati, O'zbekiston",
        our_location: "Bizning Manzil",
        footer_description: "Biz yuqori sifatli avtomobil konditsioner qismlarini ishlab chiqarishga ixtisoslashganmiz, bardoshlilik va samaradorlikni kafolatlaymiz.",
        quick_links_title: "Tez Havolalar",
        footer_about_link: "Haqida",
        footer_products_link: "Mahsulotlar",
        footer_partner_link: "Hamkorlikka Kirish",
        footer_contact_link: "Biz bilan Bog'lanish",
        copyright: "© 2025 IOTA. Barcha huquqlar himoyalangan.",
        partner_modal_title: "Hamkor Bo'ling",
        full_name_label: "To'liq Ism",
        email_label: "Elektron Pochta",
        company_name_label: "Kompaniya Nomi",
        message_label: "Xabar",
        submit_partner: "Yuborish"
    },
    ru: {
        about: "О нас",
        products: "Продукты",
        advantages: "Преимущества",
        partner: "Стать партнером",
        contact: "Связаться с нами",
        hero_title: "Премиум-автозапчасти для кондиционеров",
        hero_description: "Ощутите высокую производительность охлаждения с нашими передовыми автомобильными компонентами кондиционеров.",
        hero_get_in_touch: "Связаться с нами",
        hero_products: "Продукты",
        inquiry_tab: "Запрос продукта",
        status_tab: "Статус заказа",
        support_tab: "Поддержка",
        product_name_label: "Название продукта",
        product_name_value: "Модель трубки АС А",
        quantity_label: "Количество",
        quantity_value: "1000 шт.",
        delivery_date_label: "Дата доставки",
        delivery_date_value: "01.08.2025",
        part_no_label: "Номер детали",
        part_no_value: "1155",
        submit_inquiry: "Отправить запрос!",
        status_text: "Раздел статуса заказа скоро появится...",
        support_text: "Раздел поддержки скоро появится...",
        products_title: "Продукты",
        explore_products: "Изучите наши продукты",
        products_description: "Мы предлагаем высококачественные трубки для автомобильных кондиционеров для повышения производительности вашего автомобиля.",
        request_quote_1: "Запросить цену",
        request_quote_2: "Запросить цену",
        request_quote_3: "Запросить цену",
        request_quote_4: "Запросить цену",
        request_quote_5: "Запросить цену",
        request_quote_6: "Запросить цену",
        request_quote_7: "Запросить цену",
        see_all: "Показать все",
        solutions_title: "Решения",
        iota_solutions: "<span class='text-red-500 font-bold'>IOTA</span> Решения",
        solutions_description: "IOTA предоставляет высококачественные трубки для автомобильных кондиционеров и экспертную поддержку для улучшения систем охлаждения автомобилей.",
        product_manufacturing_title: "Производство продукции",
        product_manufacturing_description: "Мы производим прочные трубки АС, такие как модели A и B, с быстрой доставкой.",
        expert_guidance_title: "Экспертное руководство",
        expert_guidance_description: "Наша команда предоставляет профессиональные рекомендации и решения для ваших систем трубок АС.",
        tailored_solutions_title: "Индивидуальные решения",
        tailored_solutions_description: "Мы разрабатываем индивидуальные продукты для трубок, соответствующие вашим уникальным автомобильным требованиям.",
        advantages_title: "ПРЕИМУЩЕСТВА",
        why_choose_iota: "Почему выбрать IOTA?",
        advantages_description: "Мы предлагаем высококачественные трубки для автомобильных кондиционеров с надежными преимуществами. Узнайте, почему IOTA выделяется.",
        simple_ordering: "Простое оформление заказа",
        simple_ordering_description: "Заказывайте трубки АС с простым и быстрым процессом, чтобы поддерживать производство на ходу.",
        high_durability: "Высокая долговечность",
        high_durability_description: "Наши трубки изготовлены из высококачественных материалов для долгосрочной работы.",
        professional_agent: "Профессиональный агент",
        professional_agent_description: "Наша команда предоставляет экспертную поддержку для помощи в ваших потребностях в трубках.",
        quality_assurance: "Гарантия качества",
        quality_assurance_description: "Мы обеспечиваем долговечность трубок с помощью строгих проверок качества для безопасного использования.",
        customer_satisfaction: "Удовлетворенность клиентов",
        customer_satisfaction_description: "Довольны нашими продуктами или получите поддержку, если они не оправдывают ожиданий.",
        order_tracking: "Отслеживание заказа",
        order_tracking_description: "Отслеживайте статус вашего заказа с нашими обновлениями в реальном времени для спокойствия.",
        partner_title: "СТАТЬ НАШИМ ПАРТНЕРОМ",
        become_partner: "Стать партнером",
        partner_description: "Присоединяйтесь к IOTA и развивайте свой бизнес с высококачественными решениями для автомобильных кондиционеров. Мы ищем долгосрочных партнеров по всему миру.",
        apply_partner: "Подать заявку на партнерство",
        get_in_touch_title: "СВЯЗАТЬСЯ С НАМИ",
        contact_us_title: "Свяжитесь с нами",
        contact_description: "Если вам нужна консультация с нами, вы можете написать сообщение или позвонить, мы ответим как можно скорее",
        email_contact: "jooon.hwang@iotauz.com",
        phone_contact: "+998 94 245 0606",
        hours_contact: "Пн - Пт: 8:00 - 17:00",
        address_contact: "ул. Вохид Хайдаров 1, Чирчик, Ташкентская область, Узбекистан",
        our_location: "Наше местоположение",
        footer_description: "Мы специализируемся на производстве высококачественных автомобильных кондиционерных деталей, обеспечивая долговечность и производительность.",
        quick_links_title: "Быстрые ссылки",
        footer_about_link: "О нас",
        footer_products_link: "Продукты",
        footer_partner_link: "Стать партнером",
        footer_contact_link: "Связаться с нами",
        copyright: "© 2025 IOTA. Все права защищены.",
        partner_modal_title: "Стать партнером",
        full_name_label: "Полное имя",
        email_label: "Электронная почта",
        company_name_label: "Название компании",
        message_label: "Сообщение",
        submit_partner: "Отправить"
    },
    ko: {
        about: "소개",
        products: "제품",
        advantages: "장점",
        partner: "파트너 되기",
        contact: "문의하기",
        hero_title: "프리미엄 자동차 AC 부품",
        hero_description: "우리의 세계적인 자동차 AC 부품으로 고성능 냉각을 경험해 보세요.",
        hero_get_in_touch: "문의하기",
        hero_products: "제품",
        inquiry_tab: "제품 문의",
        status_tab: "주문 상태",
        support_tab: "지원",
        product_name_label: "제품 이름",
        product_name_value: "AC 파이프 모델 A",
        quantity_label: "수량",
        quantity_value: "1000개",
        delivery_date_label: "배송 날짜",
        delivery_date_value: "01.08.2025",
        part_no_label: "부품 번호",
        part_no_value: "1155",
        submit_inquiry: "문의 제출!",
        status_text: "주문 상태 섹션은 곧 제공됩니다...",
        support_text: "지원 섹션은 곧 제공됩니다...",
        products_title: "제품",
        explore_products: "제품 살펴보기",
        products_description: "우리는 자동차 에어컨용 고품질 파이프를 제공하여 차량 성능을 향상시킵니다.",
        request_quote_1: "견적 요청",
        request_quote_2: "견적 요청",
        request_quote_3: "견적 요청",
        request_quote_4: "견적 요청",
        request_quote_5: "견적 요청",
        request_quote_6: "견적 요청",
        request_quote_7: "견적 요청",
        see_all: "모두 보기",
        solutions_title: "솔루션",
        iota_solutions: "<span class='text-red-500 font-bold'>IOTA</span> 솔루션",
        solutions_description: "IOTA는 차량 냉각 시스템을 향상시키기 위해 고품질 자동차 에어컨 파이프와 전문 지원을 제공합니다.",
        product_manufacturing_title: "제품 제조",
        product_manufacturing_description: "우리는 빠른 배송과 함께 모델 A 및 모델 B와 같은 내구성 있는 AC 파이프를 생산합니다.",
        expert_guidance_title: "전문 가이드",
        expert_guidance_description: "저희 팀은 AC 파이프 시스템에 대한 전문적인 가이드와 솔루션을 제공합니다.",
        tailored_solutions_title: "맞춤형 솔루션",
        tailored_solutions_description: "우리는 귀하의 독특한 자동차 요구사항에 맞는 맞춤형 파이프 제품을 설계합니다.",
        advantages_title: "장점",
        why_choose_iota: "왜 IOTA를 선택해야 하나요?",
        advantages_description: "우리는 신뢰할 수 있는 이점과 함께 고품질 자동차 에어컨 파이프를 제공합니다. IOTA가 두드러지는 이유를 알아보세요.",
        simple_ordering: "간단한 주문",
        simple_ordering_description: "간단하고 빠른 프로세스로 AC 파이프를 주문하여 생산을 유지하세요.",
        high_durability: "높은 내구성",
        high_durability_description: "우리의 파이프는 장기적인 성능을 위해 고품질 재료로 만들어졌습니다.",
        professional_agent: "전문 에이전트",
        professional_agent_description: "저희 팀은 파이프 요구사항에 대한 전문 지원을 제공합니다.",
        quality_assurance: "품질 보증",
        quality_assurance_description: "우리는 안전한 사용을 위해 엄격한 품질 검사를 통해 파이프 내구성을 보장합니다.",
        customer_satisfaction: "고객 만족",
        customer_satisfaction_description: "제품에 만족하거나 기대에 미치지 못하면 지원을 받으세요.",
        order_tracking: "주문 추적",
        order_tracking_description: "실시간 업데이트로 주문 상태를 추적하여 안심하세요.",
        partner_title: "우리는 함께",
        become_partner: "파트너 되기",
        partner_description: "IOTA에 합류하여 고품질 자동차 AC 솔루션으로 사업을 성장시키세요. 우리는 전 세계적으로 장기적인 파트너를 찾고 있습니다.",
        apply_partner: "파트너 신청",
        get_in_touch_title: "문의하기",
        contact_us_title: "문의하기",
        contact_description: "저희와 상담이 필요하시면 메시지를 보내거나 전화하실 수 있으며, 최대한 빨리 응답하겠습니다.",
        email_contact: "jooon.hwang@iotauz.com",
        phone_contact: "+998 94 245 0606",
        hours_contact: "월 - 금: 오전 8시 - 오후 5시",
        address_contact: "우즈베키스탄 타쉬켄트 지역 치르치크, 보히드 하이다로프 가 1번지",
        our_location: "우리 위치",
        footer_description: "우리는 내구성과 성능을 보장하는 고품질 자동차 에어컨 부품 제조에 특화되어 있습니다.",
        quick_links_title: "빠른 링크",
        footer_about_link: "소개",
        footer_products_link: "제품",
        footer_partner_link: "파트너 되기",
        footer_contact_link: "문의하기",
        copyright: "© 2025 IOTA. 모든 권리 보유.",
        partner_modal_title: "파트너 되기",
        full_name_label: "전체 이름",
        email_label: "이메일",
        company_name_label: "회사 이름",
        message_label: "메시지",
        submit_partner: "제출"
    }
};

// Set initial language
let currentLanguage = 'en';

// Update content based on language
function updateLanguage(lang) {
    currentLanguage = lang;
    const t = translations[lang];

    document.getElementById('about-link').textContent = t.about;
    document.getElementById('products-link').textContent = t.products;
    document.getElementById('advantages-link').textContent = t.advantages;
    document.getElementById('partner-link').textContent = t.partner;
    document.getElementById('contact-link').textContent = t.contact;
    document.getElementById('hero-title').textContent = t.hero_title;
    document.getElementById('hero-description').textContent = t.hero_description;
    document.getElementById('hero-get-in-touch').textContent = t.hero_get_in_touch;
    document.getElementById('hero-products').textContent = t.hero_products;
    document.getElementById('inquiry-tab').textContent = t.inquiry_tab;
    document.getElementById('status-tab').textContent = t.status_tab;
    document.getElementById('support-tab').textContent = t.support_tab;
    document.getElementById('product-name-label').textContent = t.product_name_label;
    document.getElementById('product-name-value').textContent = t.product_name_value;
    document.getElementById('quantity-label').textContent = t.quantity_label;
    document.getElementById('quantity-value').textContent = t.quantity_value;
    document.getElementById('delivery-date-label').textContent = t.delivery_date_label;
    document.getElementById('delivery-date-value').textContent = t.delivery_date_value;
    document.getElementById('part-no-label').textContent = t.part_no_label;
    document.getElementById('part-no-value').textContent = t.part_no_value;
    document.getElementById('submit-inquiry').textContent = t.submit_inquiry;
    document.getElementById('status-text').textContent = t.status_text;
    document.getElementById('support-text').textContent = t.support_text;
    document.getElementById('products-title').textContent = t.products_title;
    document.getElementById('explore-products').textContent = t.explore_products;
    document.getElementById('products-description').textContent = t.products_description;
    document.getElementById('request-quote-1').textContent = t.request_quote_1;
    document.getElementById('request-quote-2').textContent = t.request_quote_2;
    document.getElementById('request-quote-3').textContent = t.request_quote_3;
    document.getElementById('request-quote-4').textContent = t.request_quote_4;
    document.getElementById('request-quote-5').textContent = t.request_quote_5;
    document.getElementById('request-quote-6').textContent = t.request_quote_6;
    document.getElementById('request-quote-7').textContent = t.request_quote_7;
    document.getElementById('see-all').textContent = t.see_all;
    document.getElementById('solutions-title').textContent = t.solutions_title;
    document.getElementById('iota-solutions').innerHTML = t.iota_solutions;
    document.getElementById('solutions-description').textContent = t.solutions_description;
    document.getElementById('product-manufacturing-title').textContent = t.product_manufacturing_title;
    document.getElementById('product-manufacturing-description').textContent = t.product_manufacturing_description;
    document.getElementById('expert-guidance-title').textContent = t.expert_guidance_title;
    document.getElementById('expert-guidance-description').textContent = t.expert_guidance_description;
    document.getElementById('tailored-solutions-title').textContent = t.tailored_solutions_title;
    document.getElementById('tailored-solutions-description').textContent = t.tailored_solutions_description;
    document.getElementById('advantages-title').textContent = t.advantages_title;
    document.getElementById('why-choose-iota').textContent = t.why_choose_iota;
    document.getElementById('advantages-description').textContent = t.advantages_description;
    document.getElementById('simple-ordering').textContent = t.simple_ordering;
    document.getElementById('simple-ordering-description').textContent = t.simple_ordering_description;
    document.getElementById('high-durability').textContent = t.high_durability;
    document.getElementById('high-durability-description').textContent = t.high_durability_description;
    document.getElementById('professional-agent').textContent = t.professional_agent;
    document.getElementById('professional-agent-description').textContent = t.professional_agent_description;
    document.getElementById('quality-assurance').textContent = t.quality_assurance;
    document.getElementById('quality-assurance-description').textContent = t.quality_assurance_description;
    document.getElementById('customer-satisfaction').textContent = t.customer_satisfaction;
    document.getElementById('customer-satisfaction-description').textContent = t.customer_satisfaction_description;
    document.getElementById('order-tracking').textContent = t.order_tracking;
    document.getElementById('order-tracking-description').textContent = t.order_tracking_description;
    document.getElementById('partner-title').textContent = t.partner_title;
    document.getElementById('become-partner').textContent = t.become_partner;
    document.getElementById('partner-description').textContent = t.partner_description;
    document.getElementById('apply-partner').textContent = t.apply_partner;
    document.getElementById('get-in-touch-title').textContent = t.get_in_touch_title;
    document.getElementById('contact-us-title').textContent = t.contact_us_title;
    document.getElementById('contact-description').textContent = t.contact_description;
    document.getElementById('email-contact').textContent = t.email_contact;
    document.getElementById('phone-contact').textContent = t.phone_contact;
    document.getElementById('hours-contact').textContent = t.hours_contact;
    document.getElementById('address-contact').textContent = t.address_contact;
    document.getElementById('our-location').textContent = t.our_location;
    document.getElementById('footer-description').textContent = t.footer_description;
    document.getElementById('quick-links-title').textContent = t.quick_links_title;
    document.getElementById('footer-about-link').textContent = t.footer_about_link;
    document.getElementById('footer-products-link').textContent = t.footer_products_link;
    document.getElementById('footer-partner-link').textContent = t.footer_partner_link;
    document.getElementById('footer-contact-link').textContent = t.footer_contact_link;
    document.getElementById('copyright').textContent = t.copyright;
    document.getElementById('partner-modal-title').textContent = t.partner_modal_title;
    document.getElementById('full-name-label').textContent = t.full_name_label;
    document.getElementById('email-label').textContent = t.email_label;
    document.getElementById('company-name-label').textContent = t.company_name_label;
    document.getElementById('message-label').textContent = t.message_label;
    document.getElementById('submit-partner').textContent = t.submit_partner;
}

// Language selector event listener
document.getElementById('language-select').addEventListener('change', function () {
    updateLanguage(this.value);
});

// Initial update
updateLanguage(currentLanguage);

// Existing scripts for other functionalities
function openModal(imgSrc) {
    document.getElementById("modalImage").src = imgSrc;
    document.getElementById("imgModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("imgModal").classList.add("hidden");
    document.getElementById("modalImage").src = "";
}

// Optional: Close modal on background click
document.getElementById("imgModal").addEventListener("click", function (e) {
    if (e.target === this) closeModal();
});

function showMore() {
    document.querySelectorAll('.extra-card').forEach(card => card.classList.remove('hidden'));
    event.target.style.display = 'none';
}

const buttons = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.tab-content');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        buttons.forEach(btn => {
            btn.classList.remove('text-red-500', 'font-semibold', 'border-b-2', 'border-red-500');
            btn.classList.add('text-gray-400');
        });

        contents.forEach(content => content.classList.add('hidden'));

        button.classList.add('text-red-500', 'font-semibold', 'border-b-2', 'border-red-500');
        button.classList.remove('text-gray-400');
        document.getElementById(button.dataset.tab).classList.remove('hidden');
    });
});