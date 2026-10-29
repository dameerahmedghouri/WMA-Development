import React from 'react'
import ResumeSection from "../../components/resume-section/ResumeSection.jsx"
import { ResumeData, SkillData } from "../../components/constants/ResumeConstant.jsx"

function Resume() {
  return (
    <article className="resume active" data-page="resume">

      <header>
        <h2 className="h2 article-title">Resume</h2>
      </header>

      {ResumeData.map((section, index) => (
        <ResumeSection
          key={index}
          title={section.title}
          data={section.data}
          icon={section.icon}
        />
      ))}

      <section className="skill">

        <h3 className="h3 skills-title">My skills</h3>

        <ul className="skills-list content-card">

          {SkillData.map((skill, index) => (
            <li className="skills-item" key={index}>

              <div className="title-wrapper">
                <h5 className="h5">{skill.title}</h5>
                <data value={skill.value}>{skill.value}%</data>
              </div>

              <div className="skill-progress-bg">
                <div
                  className="skill-progress-fill"
                  style={{ width: `${skill.value}%` }}
                ></div>
              </div>

            </li>
          ))}

        </ul>

      </section>

    </article>
  )
}

export default Resume
