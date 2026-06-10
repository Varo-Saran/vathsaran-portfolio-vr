import React from 'react';
import GlobalLayout from './components/GlobalLayout';
import Hero from './components/Hero';
import SkillsLoadout from './components/SkillsLoadout';
import ProjectsBank from './components/ProjectsBank';
import OperationsRecord from './components/OperationsRecord';
import ContactForm from './components/ContactForm';

function App() {
  return (
    <GlobalLayout>
      <Hero />
      <SkillsLoadout />
      <ProjectsBank />
      <OperationsRecord />
      <ContactForm />
    </GlobalLayout>
  );
}

export default App;
