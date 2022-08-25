import { Form, Input, Select, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Submission } from '@/models/submission';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

interface CreateFormProps extends FormComponentProps {
  edit: boolean | undefined;
  modalVisible: boolean | undefined;
  values: Partial<Submission> | undefined;
  handleAdd: (fieldsValue: { desc: string }) => void;
  handleModalVisible: () => void;
}

class CreateForm extends Component<CreateFormProps> {
  render() {
    const { modalVisible, form, handleAdd, handleModalVisible, values, edit } = this.props;
   
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleAdd(fieldsValue);
      });
    };

    return (
      <Modal
        width="680px"
        destroyOnClose
        title={
          edit
            ? "Edição de Submissão"
            : "Registo de Submissão"
        }
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form {...formItemLayout}>
          <FormItem label="Ano">
            {form.getFieldDecorator('Year', {
              initialValue: (values as Partial<Submission>).year,
              rules: [
                { required: true, message: formatMessage({ id: 'security.field.required' }) },
              ],
            })(
              <Input  />,
            )}
          </FormItem>
          <FormItem label="Trimestre">
            {form.getFieldDecorator('Quarter', {
              initialValue: (values as Partial<Submission>).quarter,
              rules: [
                { required: true, message: formatMessage({ id: 'security.field.required' }) },
              ],
            })(
              <Select
                
                style={{ width: '100%' }}
              >
                <Option value="Q1"> Q1 </Option>
                <Option value="Q2"> Q2 </Option>
                <Option value="Q3"> Q3 </Option>
                <Option value="Q4"> Q4 </Option>
              </Select>,
            )}
          </FormItem>
          
          <FormItem label="Parceiro">
            {form.getFieldDecorator('Partner', {
              initialValue: (values as Partial<Submission>).partner,
              rules: [
                { required: true, message: formatMessage({ id: 'security.field.required' }) },
              ],
            })(
              <Select
                placeholder={formatMessage({ id: 'security.form.choose' })}
                style={{ width: '100%' }}
              >
                <Option value="ARIEL"> ARIEL </Option>
                <Option value="CCS"> CCS </Option>
                <Option value="ECHO"> ECHO </Option>
                <Option value="EGPAF"> EGPAF </Option>
                <Option value="FGH"> FGH </Option>
                <Option value="ICAP"> ICAP </Option>
                <Option value="M2M"> M2M </Option>
              </Select>,
            )}
          </FormItem>
          <FormItem label="Nome do Ficheiro">
            {form.getFieldDecorator('Filename', {
              initialValue: (values as Partial<Submission>).filename,
              rules: [
                { required: true, message: formatMessage({ id: 'security.field.required' }) },
              ],
            })(
                <Input  />,
            )}
          </FormItem>
          <FormItem label="Password do Ficheiro">
            {form.getFieldDecorator('Password', {
              initialValue: (values as Partial<Submission>).password,
              rules: [
                { required: true, message: formatMessage({ id: 'security.field.required' }) },
              ],
            })(
                <Input  />,
            )}
          </FormItem>
          
        </Form>
      </Modal>
    );
  }
}

export default Form.create<CreateFormProps>()(CreateForm);
