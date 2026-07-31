'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// Doctor data
const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Gynecologist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80',
    experience: '15 years',
    rating: 4.9,
    reviews: 128,
    education: 'MD - Obstetrics & Gynecology',
    hospital: "Women's Wellness Center",
    languages: ['English', 'Spanish'],
    specializations: ['PCOS', 'Endometriosis', 'Fertility'],
    available: true,
    nextAvailable: 'Today',
  },
  {
    id: 2,
    name: 'Dr. Emily Chen',
    specialty: 'Endocrinologist',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80',
    experience: '12 years',
    rating: 4.8,
    reviews: 96,
    education: 'MD - Endocrinology',
    hospital: 'Metropolitan Medical Center',
    languages: ['English', 'Mandarin'],
    specializations: ['PCOS', 'Thyroid Disorders', 'Hormonal Imbalance'],
    available: true,
    nextAvailable: 'Tomorrow',
  },
  {
    id: 3,
    name: 'Dr. Michael Rodriguez',
    specialty: 'Gynecologist',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80',
    experience: '20 years',
    rating: 4.9,
    reviews: 215,
    education: 'MD - Obstetrics & Gynecology',
    hospital: 'City General Hospital',
    languages: ['English', 'Spanish'],
    specializations: ['PCOS', 'High-Risk Pregnancy', 'Laparoscopic Surgery'],
    available: false,
    nextAvailable: 'Next Week',
  },
  {
    id: 4,
    name: 'Dr. Priya Patel',
    specialty: 'Fertility Specialist',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80',
    experience: '10 years',
    rating: 4.7,
    reviews: 82,
    education: 'MD - Reproductive Endocrinology',
    hospital: 'Fertility Care Center',
    languages: ['English', 'Hindi', 'Gujarati'],
    specializations: ['PCOS', 'IVF', 'Fertility Treatments'],
    available: true,
    nextAvailable: 'Today',
  },
  {
    id: 5,
    name: 'Dr. Lisa Thompson',
    specialty: 'Nutritionist',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80',
    experience: '8 years',
    rating: 4.8,
    reviews: 64,
    education: 'PhD - Clinical Nutrition',
    hospital: 'Wellness Nutrition Center',
    languages: ['English'],
    specializations: ['PCOS Diet', 'Weight Management', 'Hormonal Balance'],
    available: true,
    nextAvailable: 'Today',
  },
  {
    id: 6,
    name: 'Dr. James Wilson',
    specialty: 'Endocrinologist',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80',
    experience: '18 years',
    rating: 4.9,
    reviews: 156,
    education: 'MD - Endocrinology',
    hospital: 'Hormone Health Institute',
    languages: ['English'],
    specializations: ['PCOS', 'Adrenal Disorders', 'Diabetes'],
    available: true,
    nextAvailable: 'Tomorrow',
  },
  {
    id: 7,
    name: 'Dr. Maria Garcia',
    specialty: 'Gynecologist',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80',
    experience: '14 years',
    rating: 4.8,
    reviews: 112,
    education: 'MD - Obstetrics & Gynecology',
    hospital: "Women's Health Clinic",
    languages: ['English', 'Spanish'],
    specializations: ['PCOS', 'Menstrual Disorders', 'Adolescent Care'],
    available: false,
    nextAvailable: 'Next Week',
  },
  {
    id: 8,
    name: 'Dr. David Kim',
    specialty: 'Fertility Specialist',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80',
    experience: '16 years',
    rating: 4.9,
    reviews: 178,
    education: 'MD - Reproductive Medicine',
    hospital: 'Fertility Solutions Center',
    languages: ['English', 'Korean'],
    specializations: ['PCOS', 'IVF', 'Reproductive Surgery'],
    available: true,
    nextAvailable: 'Today',
  },
  {
    id: 9,
    name: 'Dr. Rachel Green',
    specialty: 'Nutritionist',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80',
    experience: '9 years',
    rating: 4.7,
    reviews: 89,
    education: 'PhD - Nutrition Science',
    hospital: 'Nutritional Wellness Center',
    languages: ['English'],
    specializations: ['PCOS Diet', 'Metabolic Health', 'Lifestyle Medicine'],
    available: true,
    nextAvailable: 'Tomorrow',
  },
  {
    id: 10,
    name: 'Dr. Amanda Martinez',
    specialty: 'Gynecologist',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80',
    experience: '11 years',
    rating: 4.8,
    reviews: 94,
    education: 'MD - Obstetrics & Gynecology',
    hospital: "Women's Care Specialists",
    languages: ['English', 'Spanish'],
    specializations: ['PCOS', 'Endometriosis', 'Minimally Invasive Surgery'],
    available: true,
    nextAvailable: 'Today',
  },
  {
    id: 11,
    name: 'Dr. John Anderson',
    specialty: 'Endocrinologist',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80',
    experience: '22 years',
    rating: 4.9,
    reviews: 245,
    education: 'MD - Endocrinology',
    hospital: 'Endocrine Institute',
    languages: ['English'],
    specializations: ['PCOS', 'Thyroid Disorders', 'Metabolic Disorders'],
    available: false,
    nextAvailable: 'Next Week',
  },
  {
    id: 12,
    name: 'Dr. Sophie Williams',
    specialty: 'Fertility Specialist',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80',
    experience: '13 years',
    rating: 4.8,
    reviews: 116,
    education: 'MD - Reproductive Endocrinology',
    hospital: 'Family Fertility Center',
    languages: ['English', 'French'],
    specializations: ['PCOS', 'IVF', 'Fertility Preservation'],
    available: true,
    nextAvailable: 'Tomorrow',
  },
  {
    id: 13,
    name: 'Dr. Robert Lee',
    specialty: 'Gynecologist',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80',
    experience: '19 years',
    rating: 4.9,
    reviews: 187,
    education: 'MD - Obstetrics & Gynecology',
    hospital: "Advanced Women's Health",
    languages: ['English', 'Mandarin'],
    specializations: ['PCOS', 'Gynecologic Surgery', 'Menstrual Disorders'],
    available: true,
    nextAvailable: 'Today',
  },
  {
    id: 14,
    name: 'Dr. Emma Davis',
    specialty: 'Nutritionist',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80',
    experience: '7 years',
    rating: 4.7,
    reviews: 72,
    education: 'PhD - Clinical Nutrition',
    hospital: 'Nutrition & Wellness Institute',
    languages: ['English'],
    specializations: ['PCOS Diet', 'Hormonal Balance', 'Weight Management'],
    available: true,
    nextAvailable: 'Today',
  },
  {
    id: 15,
    name: 'Dr. Olivia Brown',
    specialty: 'Gynecologist',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80',
    experience: '16 years',
    rating: 4.8,
    reviews: 143,
    education: 'MD - Obstetrics & Gynecology',
    hospital: "Women's Wellness Clinic",
    languages: ['English'],
    specializations: ['PCOS', 'Adolescent Gynecology', 'Hormonal Disorders'],
    available: true,
    nextAvailable: 'Tomorrow',
  },
  {
    id: 16,
    name: 'Dr. Thomas Clark',
    specialty: 'Endocrinologist',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80',
    experience: '21 years',
    rating: 4.9,
    reviews: 198,
    education: 'MD - Endocrinology',
    hospital: 'Metabolic Health Center',
    languages: ['English'],
    specializations: ['PCOS', 'Diabetes', 'Thyroid Disorders'],
    available: false,
    nextAvailable: 'Next Week',
  },
  {
    id: 17,
    name: 'Dr. Maya Shah',
    specialty: 'Fertility Specialist',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80',
    experience: '12 years',
    rating: 4.8,
    reviews: 104,
    education: 'MD - Reproductive Medicine',
    hospital: 'Fertility & IVF Center',
    languages: ['English', 'Hindi'],
    specializations: ['PCOS', 'IVF', 'Reproductive Endocrinology'],
    available: true,
    nextAvailable: 'Today',
  },
  {
    id: 18,
    name: 'Dr. Jennifer Murphy',
    specialty: 'Nutritionist',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80',
    experience: '10 years',
    rating: 4.7,
    reviews: 86,
    education: 'PhD - Nutrition Science',
    hospital: 'Integrative Nutrition Center',
    languages: ['English'],
    specializations: ['PCOS Diet', 'Metabolic Health', 'Nutritional Therapy'],
    available: true,
    nextAvailable: 'Tomorrow',
  },
  {
    id: 19,
    name: 'Dr. William Turner',
    specialty: 'Endocrinologist',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80',
    experience: '17 years',
    rating: 4.8,
    reviews: 156,
    education: 'MD - Endocrinology',
    hospital: 'Hormone & Metabolic Center',
    languages: ['English'],
    specializations: ['PCOS', 'Adrenal Disorders', 'Metabolic Syndromes'],
    available: true,
    nextAvailable: 'Today',
  },
  {
    id: 20,
    name: 'Dr. Isabella Rodriguez',
    specialty: 'Gynecologist',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80',
    experience: '14 years',
    rating: 4.9,
    reviews: 167,
    education: 'MD - Obstetrics & Gynecology',
    hospital: "Women's Health & Wellness",
    languages: ['English', 'Spanish'],
    specializations: ['PCOS', 'Menstrual Disorders', 'Minimally Invasive Surgery'],
    available: true,
    nextAvailable: 'Tomorrow',
  },
];

export default function ExpertPage() {
  // Only used as onClick handlers for the two static modal buttons in the
  // JSX below (`onclick="closeModal()"` / `onclick="closeSuccessModal()"`
  // in the original HTML) - doesn't need to run on mount, so it lives
  // outside the effect.
  function closeModal() {
    const modal = document.getElementById('consultationModal');
    if (modal) modal.style.display = 'none';
  }

  function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.style.display = 'none';
  }

  useEffect(() => {
    // Matches the original script's top-level `lucide.createIcons();`
    // (runs before the DOMContentLoaded listener even fires).
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Create a doctor card element
    function createDoctorCard(doctor) {
      const article = document.createElement('article');
      article.className = 'doctor-card';

      const stars = '\u2605'.repeat(Math.floor(doctor.rating)) + '\u2606'.repeat(5 - Math.floor(doctor.rating));

      article.innerHTML = `
        <img src="${doctor.image}" alt="Dr. ${doctor.name}" class="doctor-image">
        <div class="doctor-info">
            <h3 class="doctor-name">${doctor.name}</h3>
            <p class="doctor-specialty">${doctor.specialty}</p>
            <div class="doctor-details">
                <span><i data-lucide="briefcase" class="icon-tiny"></i> ${doctor.experience} experience</span>
                <span><i data-lucide="graduation-cap" class="icon-tiny"></i> ${doctor.education}</span>
                <span><i data-lucide="building" class="icon-tiny"></i> ${doctor.hospital}</span>
            </div>
            <div class="doctor-rating">
                <span class="star-filled">${stars}</span>
                <span>${doctor.rating} (${doctor.reviews} reviews)</span>
            </div>
            <div class="doctor-availability">
                <span class="availability-status" style="background: ${doctor.available ? '#22c55e' : '#ef4444'}"></span>
                <span>${doctor.available ? 'Available ' + doctor.nextAvailable : 'Next available ' + doctor.nextAvailable}</span>
            </div>
            <div class="doctor-actions">
                <button class="btn-primary" onclick="bookConsultation(${doctor.id})">
                    Book Consultation
                </button>
                <button class="btn-outline" onclick="viewProfile(${doctor.id})">
                    View Profile
                </button>
            </div>
        </div>
    `;

      return article;
    }

    // Render doctors to the grid
    function renderDoctors(doctorsToRender) {
      const grid = document.getElementById('doctorsGrid');
      grid.innerHTML = '';

      doctorsToRender.forEach((doctor) => {
        const card = createDoctorCard(doctor);
        grid.appendChild(card);
      });

      // Reinitialize Lucide icons for new content
      if (window.lucide) window.lucide.createIcons();
    }

    // Filter doctors based on search and filter criteria
    function filterDoctors() {
      const searchTerm = document.getElementById('doctorSearch').value.toLowerCase();
      const specialty = document.getElementById('specialtyFilter').value;
      const availability = document.getElementById('availabilityFilter').value;

      const filtered = doctors.filter((doctor) => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm) ||
          doctor.specialty.toLowerCase().includes(searchTerm) ||
          doctor.specializations.some((s) => s.toLowerCase().includes(searchTerm));

        const matchesSpecialty = !specialty || doctor.specialty === specialty;

        const matchesAvailability = !availability ||
          (availability === 'today' && doctor.nextAvailable === 'Today') ||
          (availability === 'week' && !doctor.nextAvailable.includes('Next Week'));

        return matchesSearch && matchesSpecialty && matchesAvailability;
      });

      renderDoctors(filtered);
    }

    // Generate time slots
    function generateTimeSlots(isAvailableToday) {
      const slots = [];
      const startHour = 9; // 9 AM
      const endHour = 17; // 5 PM

      for (let hour = startHour; hour <= endHour; hour++) {
        const time12h = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
        const time12h30 = hour > 12 ? `${hour - 12}:30 PM` : `${hour}:30 AM`;

        if (isAvailableToday || hour > 12) { // Only show afternoon slots if not available today
          slots.push(time12h, time12h30);
        }
      }

      return slots;
    }

    // Book consultation
    function bookConsultation(doctorId) {
      const doctor = doctors.find((d) => d.id === doctorId);
      if (!doctor) return;

      const modal = document.getElementById('consultationModal');
      document.getElementById('doctorId').value = doctorId;

      // Populate time slots based on availability
      const timeSelect = document.getElementById('preferredTime');
      timeSelect.innerHTML = '';

      const timeSlots = generateTimeSlots(doctor.available);
      timeSlots.forEach((slot) => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        timeSelect.appendChild(option);
      });

      modal.style.display = 'block';
    }

    // View doctor profile
    function viewProfile(doctorId) {
      const doctor = doctors.find((d) => d.id === doctorId);
      if (!doctor) return;

      // Here you would typically navigate to a detailed profile page
      // For now, we'll just log the action
      console.log('Viewing profile of', doctor.name);
    }

    // `createDoctorCard` injects `onclick="bookConsultation(id)"` /
    // `onclick="viewProfile(id)"` as literal HTML attribute strings (kept
    // verbatim from the original script), which resolve against the
    // global scope at click time - so these two need to be exposed on
    // `window`, exactly like plain top-level function declarations in a
    // non-module script are implicitly global.
    window.bookConsultation = bookConsultation;
    window.viewProfile = viewProfile;

    // Render all doctors initially
    renderDoctors(doctors);

    // Set up search functionality
    const searchInput = document.getElementById('doctorSearch');
    if (searchInput) searchInput.addEventListener('input', filterDoctors);

    // Set up filter functionality
    const specialtyFilter = document.getElementById('specialtyFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');

    if (specialtyFilter) specialtyFilter.addEventListener('change', filterDoctors);
    if (availabilityFilter) availabilityFilter.addEventListener('change', filterDoctors);

    // Initialize date picker min date
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    // Initialize Lucide icons for dynamic content
    if (window.lucide) window.lucide.createIcons();

    // Handle form submission
    const consultationForm = document.getElementById('consultationForm');
    function handleConsultationFormSubmit(e) {
      e.preventDefault();

      // Here you would typically send the form data to your backend
      // For now, we'll just show a success message

      const consultationModal = document.getElementById('consultationModal');
      const successModal = document.getElementById('successModal');

      consultationModal.style.display = 'none';
      successModal.style.display = 'block';

      // Reset form
      consultationForm.reset();
    }
    if (consultationForm) {
      consultationForm.addEventListener('submit', handleConsultationFormSubmit);
    }

    // Close modals when clicking outside
    function handleWindowClick(event) {
      const consultationModal = document.getElementById('consultationModal');
      const successModal = document.getElementById('successModal');

      if (event.target === consultationModal) {
        consultationModal.style.display = 'none';
      }
      if (event.target === successModal) {
        successModal.style.display = 'none';
      }
    }
    window.addEventListener('click', handleWindowClick);

    return () => {
      if (searchInput) searchInput.removeEventListener('input', filterDoctors);
      if (specialtyFilter) specialtyFilter.removeEventListener('change', filterDoctors);
      if (availabilityFilter) availabilityFilter.removeEventListener('change', filterDoctors);
      if (consultationForm) consultationForm.removeEventListener('submit', handleConsultationFormSubmit);
      window.removeEventListener('click', handleWindowClick);
      delete window.bookConsultation;
      delete window.viewProfile;
    };
  }, []);

  return (
    <>
      <title>BloomHer</title>
      <link rel="stylesheet" href="/stylepages/expert.css" />
      <Script
        src="https://unpkg.com/lucide@latest"
        strategy="afterInteractive"
        onReady={() => {
          if (window.lucide) window.lucide.createIcons();
        }}
      />

      <div className="min-h-screen">
        {/* Navigation */}
        <nav>
          <div className="container">
            <div className="nav-content">
              <div className="logo">
                <i data-lucide="heart-pulse" className="icon-rose"></i>
                <span className="brand">BloomHer</span>
              </div>
              <div className="nav-links">
                <a href="/">Home</a>
                <a href="/mainpages/expert" className="active">Doctors</a>
                <a href="/mainpages/community">Community</a>
                <a href="/mainpages/log" className="btn-primary">Sign In</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="doctors-hero">
          <div className="container">
            <div className="hero-content">
              <h1>Expert Care for Women&apos;s Health</h1>
              <p>Connect with experienced gynecologists and specialists who understand your concerns.</p>
              <div className="search-container">
                <div className="search-box">
                  <i data-lucide="search" className="icon-small"></i>
                  <input type="text" id="doctorSearch" placeholder="Search by name, specialization, or condition..." />
                </div>
                <div className="filter-box">
                  <select id="specialtyFilter">
                    <option value="">All Specialties</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Endocrinologist">Endocrinologist</option>
                    <option value="Nutritionist">Nutritionist</option>
                    <option value="Fertility Specialist">Fertility Specialist</option>
                  </select>
                  <select id="availabilityFilter">
                    <option value="">Any Availability</option>
                    <option value="today">Available Today</option>
                    <option value="week">This Week</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Doctors Grid */}
        <section className="doctors-section">
          <div className="container">
            <div className="doctors-grid" id="doctorsGrid">
              {/* Doctors will be dynamically added here */}
            </div>
          </div>
        </section>

        {/* Consultation Form Modal */}
        <div className="modal" id="consultationModal">
          <div className="modal-content">
            <button className="modal-close"><i data-lucide="x"></i></button>
            <h2>Book a Consultation</h2>
            <form id="consultationForm">
              <input type="hidden" id="doctorId" />
              <div className="form-group">
                <label htmlFor="patientName">Your Name</label>
                <input type="text" id="patientName" required />
              </div>
              <div className="form-group">
                <label htmlFor="patientAge">Age</label>
                <input type="number" id="patientAge" required min="1" max="100" />
              </div>
              <div className="form-group">
                <label htmlFor="consultationType">Consultation Type</label>
                <select id="consultationType" required>
                  <option value="video">Video Call</option>
                  <option value="chat">Private Chat</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="preferredDate">Preferred Date</label>
                <input type="date" id="preferredDate" required />
              </div>
              <div className="form-group">
                <label htmlFor="preferredTime">Preferred Time</label>
                <select id="preferredTime" required>
                  <option value="">Select Time</option>
                  {/* Time slots will be dynamically populated */}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="symptoms">Describe Your Symptoms</label>
                <textarea id="symptoms" rows="4" placeholder="Please share your symptoms and concerns..."></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="medicalHistory">Relevant Medical History</label>
                <textarea id="medicalHistory" rows="4" placeholder="Any previous conditions, medications, or treatments..."></textarea>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" id="privacyConsent" required />
                  I consent to share my medical information securely with the doctor
                </label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">Book Consultation</button>
              </div>
            </form>
          </div>
        </div>

        {/* Success Modal */}
        <div className="modal" id="successModal">
          <div className="modal-content">
            <div className="success-message">
              <i data-lucide="check-circle" className="icon-large text-success"></i>
              <h2>Consultation Booked!</h2>
              <p>Your consultation has been scheduled. You will receive a confirmation email with further details.</p>
              <button className="btn-primary" onClick={closeSuccessModal}>Close</button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer>
          <div className="container">
            <div className="footer-content">
              <div className="footer-logo">
                <i data-lucide="heart-pulse" className="icon-rose"></i>
                <span className="brand">BloomHer</span>
              </div>
              <div className="footer-links">
                <a href="/">About</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="/mainpages/contactus">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
