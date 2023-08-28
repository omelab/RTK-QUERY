## array of object validation using Formik Yup
I think i have a form data object  like :
```json
{
    "blogTitle": "this is a simple blog",
    "faq":[{"question": "why use read this blog?", "answer": "this blog helps you to write a complete validation"}] 
} 
```
In that case, I want to ensure that if either the question or the answer is filled out in a FAQ entry, the other field should also be filled out.
Here's how you can achieve this with Formik and Yup :

```tsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface Faq {
  question: string;
  answer: string;
}

interface FormData {
  title: string;
  faq: Faq[];
}

const initialValues: FormData = {
  title: '',
  faq: [{ question: '', answer: '' }],
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  faq: Yup.array().of(
    Yup.object().shape({
      question: Yup.string(),
      answer: Yup.string(),
    }).test('faq-validation', 'Either question or answer is required', function (value) {
      if (!value?.question && !value?.answer) {
        return this.createError({
          path: `${this.path}.question`,
          message: 'Either question or answer is required',
        });
      }
      return true;
    })
  ),
});

const App: React.FC = () => {
  const handleSubmit = (values: FormData) => {
    console.log(values);
  };

  return (
    <div>
      <h1>Create Blog</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors }) => (
          <Form>
            <div>
              <label htmlFor="title">Title</label>
              <Field type="text" id="title" name="title" />
              <ErrorMessage name="title" component="div" className="error" />
            </div>

            <div>
              <h2>FAQs</h2>
              {values.faq.map((faq, index) => (
                <div key={index}>
                  <h3>Question {index + 1}</h3>
                  <div>
                    <label htmlFor={`faq[${index}].question`}>Question</label>
                    <Field
                      type="text"
                      id={`faq[${index}].question`}
                      name={`faq[${index}].question`}
                    />
                  </div>
                  <div>
                    <label htmlFor={`faq[${index}].answer`}>Answer</label>
                    <Field
                      type="text"
                      id={`faq[${index}].answer`}
                      name={`faq[${index}].answer`}
                    />
                  </div>
                  <ErrorMessage
                    name={`faq[${index}].question`}
                    component="div"
                    className="error"
                  />
                  <ErrorMessage
                    name={`faq[${index}].answer`}
                    component="div"
                    className="error"
                  />
                </div>
              ))}
            </div>

            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default App;
```