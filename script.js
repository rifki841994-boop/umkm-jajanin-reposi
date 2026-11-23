// Ganti dengan nomor WhatsApp usaha (format 62, tanpa +)
const WA_NUMBER = "6289632380485";

const IMG_CIRENG = "images/cireng.jpg";
const IMG_CITUL = "images/citul.jpg";
const IMG_KATSU = "images/katsu.jpg";
const IMG_SPAGHETTI = "images/spaghetti.jpg";
const IMG_STUP = "images/stup-roti.jpg";

const products = [
  {id:"cireng", name:"Cireng isi", icon:"🥟", img:IMG_CIRENG, desc:"Cireng kenyal dengan isian pilihan, digoreng sampai garing.", price:10000, unit:"5 pcs",
   variants:["Ayam pedas","Keju","Sosis","Oncom"]},
  {id:"citul", name:"Citul", icon:"🍗", img:IMG_CITUL, desc:"Cipuk tusuk lembut, disiram bumbu gurih khas JAJANIN.", price:13000, unit:"1 porsi",
   variants:["Original","Pedas manis","Balado"]},
  {id:"katsu", name:"Chicken katsu", icon:"🍗", img:IMG_KATSU, desc:"Daging ayam berbalut tepung renyah, disajikan dengan sambal extra hot.", price:20000, unit:"1 porsi",
   variants:["Original"]},
  {id:"spaghetti", name:"Spaghetti", icon:"🍝", img:IMG_SPAGHETTI, desc:"Spaghetti saus pedas gurih dengan telur dan irisan sosis.", price:17000, unit:"1 porsi",
   variants:["Original"]},
  {id:"stup", name:"Stup Roti", icon:"🍞", img:IMG_STUP, desc:"Stup roti lembut dengan siraman susu dan taburan keju parut.", price:15000, unit:"1 box",
   variants:["Original"]}
];
const cart = {};
const rp = n => "Rp" + n.toLocaleString("id-ID");
const $ = s => document.querySelector(s);

$("#products").innerHTML = products.map(p => `
  <article class="card">
    ${p.img ? `<img class="photo" src="${p.img}" alt="${p.name} dalam boks, siap dinikmati dengan sambal">` : `<div class="ico" aria-hidden="true">${p.icon}</div>`}
    <h3>${p.name}</h3>
    <p style="margin:0;color:var(--muted)">${p.desc}</p>
    <div class="price">${rp(p.price)} <small style="font-family:Nunito;font-weight:600;color:var(--muted)">/ ${p.unit}</small></div>
    <div class="row">
      <select id="v-${p.id}" aria-label="Varian ${p.name}">${p.variants.map(v=>`<option>${v}</option>`).join("")}</select>
      <button class="add" data-id="${p.id}">Tambah</button>
    </div>
  </article>`).join("");

document.querySelectorAll(".add").forEach(b => b.onclick = () => {
  const p = products.find(x => x.id === b.dataset.id);
  const v = $("#v-" + p.id).value;
  const key = p.id + "|" + v;
  cart[key] = cart[key] || {name: p.name + " (" + v + ")", price: p.price, unit: p.unit, qty: 0};
  cart[key].qty++;
  render();
  b.textContent = "Ditambahkan";
  setTimeout(() => b.textContent = "Tambah", 900);
});

function render(){
  const keys = Object.keys(cart);
  let total = 0, count = 0;
  $("#items").innerHTML = keys.length ? keys.map(k => {
    const i = cart[k]; total += i.price * i.qty; count += i.qty;
    return `<div class="it"><div><strong>${i.name}</strong><br><small>${rp(i.price)} / ${i.unit}</small></div>
      <div class="qty"><button data-k="${k}" data-d="-1" aria-label="Kurangi">−</button><span>${i.qty}</span><button data-k="${k}" data-d="1" aria-label="Tambah">+</button></div></div>`;
  }).join("") : '<p class="empty">Keranjang masih kosong. Pilih menu dulu, ya.</p>';
  $("#total").textContent = rp(total);
  $("#count").textContent = count;
  document.querySelectorAll(".qty button").forEach(b => b.onclick = () => {
    cart[b.dataset.k].qty += +b.dataset.d;
    if (cart[b.dataset.k].qty <= 0) delete cart[b.dataset.k];
    render();
  });
}

$("#openCart").onclick = () => $("#panel").classList.add("open");
$("#closeCart").onclick = () => $("#panel").classList.remove("open");

$("#order").onclick = () => {
  const keys = Object.keys(cart);
  if (!keys.length) { alert("Keranjang masih kosong. Tambahkan menu dulu."); return; }
  const nama = $("#nama").value.trim(), alamat = $("#alamat").value.trim();
  if (!nama || !alamat) { alert("Isi nama dan alamat antar terlebih dahulu."); return; }
  let total = 0;
  const lines = keys.map(k => { const i = cart[k]; total += i.price * i.qty; return "- " + i.name + " x" + i.qty + " = " + rp(i.price * i.qty); });
  const msg = "Halo JAJANIN, saya mau pesan:\n" + lines.join("\n") + "\nTotal: " + rp(total) + "\n\nNama: " + nama + "\nAlamat: " + alamat;
  window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg), "_blank");
};
render();
