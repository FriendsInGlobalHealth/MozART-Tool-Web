import { Badge, Button, Card, Table, Col, Form, Input, Row, Select, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ColumnProps } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import { SubmissionModelState, Submission } from '@/models/submission';
import CreateForm from './components/CreateForm';
//import { getUser } from '@/utils/authorization';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

interface StandardTableColumnProps extends ColumnProps<Submission> {
    needTotal?: boolean;
    total?: number;
}

interface TableListProps extends FormComponentProps {
    dispatch: Dispatch<Action<'submissions/add' | 'submissions/fetch' | 'submissions/edit'>>;
    loading: boolean;
    submissions: SubmissionModelState;
}

interface TableListState {
    modalVisible: boolean | undefined;
    updateModalVisible: boolean;
    formValues?: { [key: string]: string };
    updateFormValues?: Partial<Submission> | undefined;
    submission?: Partial<Submission>;
    isEdit?: boolean;
}

@connect(
    ({
        submissions,
        loading,
    }: {
        submissions: SubmissionModelState;
        loading: {
            models: {
            [key: string]: boolean;
            };
        };
    }) => ({
        submissions,
        loading: loading.models.submission,
    }),
  )
class TableList extends Component<TableListProps, TableListState>{
    state: TableListState = {
        modalVisible: false,
        updateModalVisible: false,
        formValues: {},
        updateFormValues: {},
        isEdit: false,
        submission: {},
    };

    componentDidMount() {
        const { dispatch } = this.props;

        dispatch({
            type: 'submissions/fetch'
        });
    }
    handleModalVisible = (flag?: boolean) => {
        this.setState({
          isEdit: false,
          modalVisible: !!flag,
          updateFormValues: {},
          submission: {},
        });
    };
    handleUpdateModalVisible = (flag?: boolean, record?: Submission) => {
 
        this.setState({
          isEdit: true,
          modalVisible: !!flag,
          updateFormValues: record || {},
          submission: record,
        });
      };
    
    handleAdd = (fields: any) => {
        const { dispatch } = this.props;
        const { isEdit, submission } = this.state;
        let operation: any;
        const id = submission ? submission.id : undefined;
    
        if (isEdit) {
          operation = 'submissions/edit';
        } else {
          operation = 'submissions/add';
        }
    
        dispatch({
          type: operation,
          payload: { ...fields, id: id },
        });
    
        message.success("Adicionado com Sucesso!");
        this.handleModalVisible();
    };

    render() {
        const { submissions } = this.props;
        const { modalVisible, updateFormValues, isEdit } = this.state;

        const columns: StandardTableColumnProps[] = [
            {
              title: 'Id',
              dataIndex: 'id',
              key: 'Id',
            },
            {
              title: "Ano",
              dataIndex: 'year',
              key: 'year',
            },
            {
              title: "Periodo",
              dataIndex: 'quarter',
              key: 'quarter',
            },
            {
                title: "Parceiro",
                dataIndex: 'partner',
                key: 'partner',
            },
            {
                title: "Ficheiro",
                dataIndex: 'filename',
                key: 'filename',
            },
            {
                title: "Creado Por",
                dataIndex: 'createdby',
                key: 'createdby',
            },
            {
              title: "Ação",
              render: (text, record) => (
                <Fragment>
                  <a onClick={() => this.handleUpdateModalVisible(true, record)}>
                    Edit
                  </a>
                </Fragment>
              ),
            },
        ];

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
        };

        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                            Add
                        </Button>
                        </div>
                        
                        <Table rowKey="id" columns={columns} dataSource={submissions.submissions} />
                    </div>
                </Card>
                <CreateForm
                    {...parentMethods}
                    modalVisible={modalVisible}
                    values={updateFormValues}
                    edit={isEdit}
                />
            </PageHeaderWrapper>
        );
    }
}
export default Form.create<TableListProps>()(TableList);