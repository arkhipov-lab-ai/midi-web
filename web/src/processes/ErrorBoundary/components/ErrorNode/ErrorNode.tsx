import React from 'react'
import {Card, Space, Typography} from 'antd'

const {Title, Text} = Typography

export const ErrorNode: React.FC = () => {
    return (
        <Space
            orientation='vertical'
            size='large'
            align='center'
            style={{
                width: '100vw',
                height: '100vh',
            }}
        >
            <Card>
                <Space
                    orientation='vertical'
                    size='middle'
                    style={{
                        width: '100%',
                    }}
                >
                    <Title
                        level={2}
                        style={{
                            margin: 0,
                        }}
                    >
                        Something went wrong
                    </Title>
                    <Text
                        strong
                    >Please refresh the page</Text>
                </Space>
            </Card>
        </Space>
    )
}
